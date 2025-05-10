//product-router.js

import { Router } from "express";
import { productModel } from "../models/product.model.js";
import mongoose from "mongoose";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        let products = await productModel.find();
    
        res.send({result: "ok", payload: products});
    } catch (error) {
        console.error('Error al recuperar los productos:', error);
        res.send({result: "error", detail: "No se encontraron Productos!"});
    }
});

productsRouter.get("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        const product = await productModel.findOne({ id: productId });
        if (product) {
            res.send({ result: "ok", payload: product });
        } else {
            res.status(404).send({ result: "error", detail: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error al recuperar el producto por ID:', error);
        res.status(500).send({ result: "error", detail: "Error al recuperar el producto por ID" });
    }
});


productsRouter.post("/", async (req, res) => {
    const { title, description, code_bar, product_number, price, status, stock, category, thumbnails } = req.body;
     // Obtener el siguiente número para id ordinal
    const nvoNum = await getNextProductNumber();
    const productData = {
        _id: new mongoose.Types.ObjectId(),  // Genera un nuevo ObjectId para el campo _id
        title,
        description,
        code_bar,
        product_number,
        price,
        status,
        stock,
        category,
        thumbnails,
        id:`${nvoNum}`    
    };
    try {
        const result = await productModel.create(productData);
        res.send({ result: `ok. Se creó con el número ${nvoNum}`,  payload: result });
    } catch (error) {
        res.status(500).send({ result: "error", message: error.message });
    }
});



productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, product_number, stock, category } = req.body;
    const product = { title, description, price, product_number, stock, category };
  
    try {
      const result = await productModel.updateOne({ _id: id }, product); // Usar _id en lugar de id
      res.send({ result: "ok", payload: result });
    } catch (error) {
      res.status(500).send({ result: "error", message: error.message });
    }
  });

  
productsRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const result = await productModel.deleteOne({id:id});
    res.send({result:"ok", payload:result});
})


// Función para recuperar el id más grande y obtener el siguiente número disponible
async function getNextProductNumber() {
    const largestProduct = await productModel.findOne({}, {}, { sort: { 'id' : -1 } });
    return largestProduct ? largestProduct.id + 1 : 1;
}

export default productsRouter;