//index.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import productsRouter from "./router/products.router.js"
import cartsRouter from './router/carts.router.js';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import axios from 'axios'; // Importamos axios para hacer la solicitud HTTP

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log(`Servidor conectado: http://localhost:${port}`);
});

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/api/products'); // Usamos axios para hacer la solicitud HTTP
        const products = response.data.payload;  // Obtenemos los productos de la respuesta
        res.render('realTimeProducts', { products });  // Pasamos los productos a la vista
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.render('errorPage', { error: 'Ocurrió un error al obtener los productos' });
    }
});

const io = new SocketIOServer(httpServer);

io.on('connection', (socket) => {
    console.log('Cliente conectado vía WebSocket');

    socket.on('mensajeCliente', (data) => {
        console.log('Mensaje del cliente:', data);
        socket.emit('mensajeServidor', 'Hola cliente, soy el servidor 👋');
    });
});

mongoose.connect("mongodb+srv://nicotole:toletole12@cluster0.mkyvq6u.mongodb.net/EcoMystika?retryWrites=true&w=majority&appName=Cluster0");
