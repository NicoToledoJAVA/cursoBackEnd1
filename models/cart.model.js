//cart.model.js

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
  products: [
    {
        id:Number,
        title:String,
        price:Number,
        quantity:Number     
    }
  ],
  total: Number,
  id:Number
}, { versionKey: false });  // Deshabilitar el campo __v en el esquema

export const cartModel = mongoose.model("carts", cartSchema);