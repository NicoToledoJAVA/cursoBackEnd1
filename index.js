//index.js

import express from 'express';
import ProductManager from './Managers/ProductManager.js';
import CartManager from './Managers/CartManager.js';
import {

    ProductJSONDBRoute as ProdsPath,
    CartJSONDBRoute as CartPath,
    ProductAPIEndPoint as ProductAPI,
    CartAPIRouteEndPoint as CartAPI

} from './Managers/RoutesManager.js';


import ProductDBFiller from './Managers/ProductDBFiller.js';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import exphbs from 'express-handlebars';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;

const productManager = new ProductManager(ProdsPath);
const cartManager = new CartManager(CartPath);

app.use(express.json());

app.use((err, req, res, next) => {
    console.error('🛑 Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});


app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main', // el layout por defecto
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));



// Ejecutamos el llenado de productos
const rellenador = new ProductDBFiller(productManager);
rellenador.seedProducts().then(() => {

    console.log('✔️   (index.js) - - - - - > ¡La BD se rellenó exitosamente para pruebas!.');
}).catch(err => {
    console.error('Error al agregar productos:', err);
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
        products
      });
    
  });

// 📌 Ruta Básica para probar que el server anda
app.get('/', (req, res) => {
    res.send('🚀 API de productos y carritos corriendo en Express + WebSocket');
});


// 📌 Ruta para obtener todos los productos
app.get(ProductAPI + '/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al obtener productos. " + error.message });
    }
});


// 📌 Ruta para obtener un producto por su id
app.get(ProductAPI + '/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al obtener producto por id. " + error.message });
    }
});

// 📌 Ruta para agregar un producto
app.post(ProductAPI, async (req, res) => {
    try {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ error: "Faltan campos obligatorios." });
        }

        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);

        // 🔥 Emitimos el producto nuevo a todos los clientes conectados
        io.emit('nuevoProducto', newProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "⛔ 🚨 Error al agregar producto: " + error.message });
    }
});

// 📌 Ruta para actualizar un producto
app.put(ProductAPI + '/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (updatedProduct) {
            res.json(updatedProduct);

            // 🔥 WebSocket emit para producto actualizado
            io.emit('productoActualizado', updatedProduct);

        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al actualizar producto. " + error.message });
    }
});


// 📌 Ruta para eliminar un producto
app.delete(ProductAPI + '/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.pid);
        if (deletedProduct) {
            res.json({ message: 'Producto eliminado exitosamente' });

            // 🔥 WebSocket emit para producto eliminado
            io.emit('productoEliminado', { id: req.params.pid });

        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al eliminar producto. " + error.message });
    }
});

// 📌 Ruta para crear un carrito
app.post(CartAPI + '/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);

        // 🔥 WebSocket emit para nuevo carrito
        io.emit('carritoCreado', newCart);

    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al crear carrito. " + error.message });
    }
});


// 📌 Ruta para obtener un carrito por su id
app.get(CartAPI + '/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al obtener carrito. " + error });
    }
});

// 📌 Ruta para agregar un producto al JSON
app.post(CartAPI + '/:cid/product/:pid', async (req, res) => {
    try {
        const cid = Number(req.params.cid);
        const pid = Number(req.params.pid);

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: "ID de carrito o producto inválido." });
        }
        const updatedCart = await cartManager.addProductToCart(cid, pid, req.body.quantity);
        res.json(updatedCart);

        // 🔥 WebSocket emit para producto agregado al carrito
        io.emit('productoAgregadoAlCarrito', { cid, pid, cantidad: req.body.quantity });

    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al agregar producto al carrito. " + error });
    }
});


const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

// Escuchar clientes que se conectan
io.on('connection', (socket) => {
    console.log(`\n . . . \n . . .\n . . . 🟢 📡🌍  Cliente conectado vía WebSocket en http://localhost:${PORT} \n . . .\n . . .                  ✔️   -> 'index.js' \n\n`);

    socket.on('mensajeCliente', (data) => {
        console.log('📩 Mensaje del cliente:', data);
        socket.emit('mensajeServidor', 'Hola cliente, soy el servidor 👋');
    });
});

// ⬇️ ⬇️ ⬇️ Escucha
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});