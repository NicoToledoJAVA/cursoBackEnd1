// cart.router.js

import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import mongoose from "mongoose";

const cartsRouter = Router();

// Obtener todos los carritos
cartsRouter.get("/", async (req, res) => {
    try {
        let carts = await cartModel.find();
        console.log('Carritos recuperados:', carts);
        res.send({ result: "ok", payload: carts });
    } catch (error) {
        console.error('Error al recuperar los carritos:', error);
        res.send({ result: "error", detail: "No se encontraron Carritos!" });
    }
});

// Agregar un nuevo carrito
cartsRouter.post("/", async (req, res) => {
    const [ids] = req.body;

    try {
        const newCart = await cartModel.create(req.body);
        res.status(201).json({ result: "ok", payload: newCart });
    } catch (error) {
        res.status(500).json({ result: "error", message: error.message });
    }
});

cartsRouter.post("/createCart/", async (req, res) => {
    try {
        const changoObjects = await getChangoObjects(req.body.ids);
        const totalAmount = await makeTotal(changoObjects);

        const cartData = {
            _id: new mongoose.Types.ObjectId(),  // Genera un nuevo ObjectId para el campo _id
            id: await getNextCartNumber(),
            products: changoObjects.payload,
            total: totalAmount.total  // Utilizar directamente el valor numérico del total calculado
        };

        const newCart = await cartModel.create(cartData);
        res.status(201).json({ result: "ok", payload: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ result: "error", message: error.message });
    }
});

// Actualizar un carrito por su id
cartsRouter.put("/:id", async (req, res) => {
    try {
        const updatedCart = await cartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ result: "ok", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ result: "error", message: error.message });
    }
});

// Eliminar un carrito por su id
cartsRouter.delete("/:id", async (req, res) => {
    try {
        const result = await cartModel.findByIdAndDelete(req.params.id);
        res.json({ result: "ok", payload: result });
    } catch (error) {
        res.status(500).json({ result: "error", message: error.message });
    }
});

// Función para recuperar el id más grande y obtener el siguiente número disponible
async function getNextCartNumber() {
    const largestCart = await cartModel.findOne({}, {}, { sort: { 'id' : -1 } });
    return largestCart ? largestCart.id + 1 : 1;
}

async function getChangoObjects(IDs) {
    try {
        // Obtener los productos originales
        const originalProducts = await getSingleProductsByIds(IDs);
        
        // Crear una nueva lista con los atributos id, title y price
        const selectedProductDetails = originalProducts.payload.map(product => {
            return { id: product.id, title: product.title, price: product.price, quantity: 1 };
        });

        return { result: "ok", payload: selectedProductDetails };
    } catch (error) {
        console.error('Error al recuperar los detalles de los productos:', error);
        return { result: "error", detail: "Error al recuperar los detalles de los productos" };
    }
}

async function getSingleProductsByIds(IDs) {
    try {
        const productIds = IDs.map(id => parseInt(id));
        
        const products = await productModel.find({ id: { $in: productIds } });
        if (products.length > 0) {
            return { result: "ok", payload: products };
        } else {
            return { result: "error", detail: "Productos no encontrados" };
        }
    } catch (error) {
        console.error('Error al recuperar los productos por ID:', error);
        return { result: "error", detail: "Error al recuperar los productos por ID" };
    }
}

async function makeTotal(changoObjects) {
    try {
        const total = changoObjects.payload.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
        return { result: "ok", total };
    } catch (error) {
        console.error('Error al calcular el total de la compra:', error);
        return { result: "error", detail: "Error al calcular el total de la compra" };
    }
}


export default cartsRouter;