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

const app = express();
const PORT = 8080;

const productManager = new ProductManager(ProdsPath);
const cartManager = new CartManager(CartPath);

app.use(express.json());

// Ejecutamos el llenado de productos
const rellenador = new ProductDBFiller(productManager);
rellenador.seedProducts().then(() => {

    console.log('✔️   (index.js) - - - - - > ¡La BD se rellenó exitosamente para pruebas!.');
}).catch(err => {
    console.error('Error al agregar productos:', err);
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

        // Validar que los campos obligatorios estén presentes
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ error: "Faltan campos obligatorios." });
        }


        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
        res.status(201).json(newProduct);
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
app.post(CartAPI + '/:cid' + '/product/:pid', async (req, res) => {
    try {
        const cid = Number(req.params.cid);  // Convertimos a número
        const pid = Number(req.params.pid);  // Convertimos a número       
        const updatedCart = await cartManager.addProductToCart(cid, pid, req.body.quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "⛔ 🚨   ('index.js' ...) - - > Error al agregar producto al carrito. " + error });
    }
});
app.listen(PORT, () => console.log(`\n . . . \n . . .\n . . . 📡🌍  Servidor corriendo en http://localhost:${PORT} \n . . .\n . . .                  ✔️   -> 'index.js' \n\n`));