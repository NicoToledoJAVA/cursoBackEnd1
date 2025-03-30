//CartManager.js

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './ProductManager.js';

import {

    ProductJSONDBRoute as ProdsPath,


} from './RoutesManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, filePath);
        this.dirPath = path.dirname(this.path);
        this.initFile(); 
    }

    // 🔹 La función initFile crea la carpeta y el archivo si no existen
    async initFile() {
        try {
            // Verifica si la carpeta 'persistence' existe, si no, la crea
            await fs.mkdir(this.dirPath, { recursive: true });
            console.log(`✔️   (CartManager.js) - - > Verificación: La carpeta '${this.dirPath}' está disponible.`);
    
            // Verifica si el archivo carts.json existe
            await fs.access(this.path);
            console.log(`✔️   (CartManager.js) - - > Archivo '${this.path}' existía. Existencia verificada.`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si no existe, lo crea con un array vacío
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
                console.log(`✔️   El archivo '${this.path}' no existía. Lo creamos en este acto.`);
            } else {
                console.error('⛔ 🚨   (CartMana...) - - > Error al verificar archivo:', error);
            }
        }
    }

    // Método para crear un nuevo carrito
async createCart() {
    try {
        const carts = await this.getCarts();

        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

        return newCart;
    } catch (error) {
        console.error("⚠️ Error al crear carrito:", error);
        throw error;
    }
}

    // Método para obtener un carrito por su id
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === parseInt(id));
        } catch (error) {
            console.error("⚠️ Error al obtener carrito por id:", error);
            return null;
        }
    }

    // Método para agregar un producto al carrito
    async addProductToCart(cid, pid, quantity) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === parseInt(cid));
    
            if (!cart) {
                console.error(`⚠️ Carrito con ID ${cid} no encontrado.`);
                return null;
            }          
    
            const productManager = new ProductManager(ProdsPath);                
            const product = await productManager.getProductById(pid);
    
            if (!product) {
                console.error(`⚠️ Producto con ID ${pid} no encontrado.`);
                return null;
            }
    
            const existingProduct = cart.products.find(p => p.product === pid);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
    
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error("⚠️ Error al agregar producto al carrito:", error);
            return null;
        }
    }

    // Método para obtener todos los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("⚠️ Error al obtener los carritos:", error);
            return [];
        }
    }
}

export default CartManager;