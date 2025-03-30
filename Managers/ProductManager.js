//ProductManager.js 

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor(filePath) {
        this.path = path.resolve(__dirname, filePath); // Convierte la ruta en absoluta
        this.dirPath = path.dirname(this.path); // Obtiene el directorio de la ruta
        this.initFile(); // Llamamos a la función 'initFile' al instanciar la clase
    }

    // 🔹 La función initFile crea la carpeta y el archivo si no existen
    async initFile() {
        try {
            // Verifica si la carpeta 'persistence' existe, si no, la crea
            await fs.mkdir(this.dirPath, { recursive: true });
            console.log(`✔️   (ProductMana...) - - > Verificación: La carpeta '${this.dirPath}' está disponible.`);

            // Verifica si el archivo products.json existe
            await fs.access(this.path);
            console.log(`✔️   (ProductMana...) - - > Archivo '${this.path}' existía. Existencia verificada.`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si no existe, lo crea con un array vacío
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
                console.log(`✔️   El archivo '${this.path}' no existía. Lo creamos en este acto.`);
            } else {
                console.error('⛔ 🚨   (ProductMana...) - - > Error al verificar archivo:', error);
            }
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            // Si no se envían imágenes, asignamos el array por defecto
            if (!product.thumbnails || !Array.isArray(product.thumbnails) || product.thumbnails.length === 0) {
                product.thumbnails = [
                    "imagenBase64 - -> 1",
                    "imagenBase64 - -> 2",
                    "imagenBase64 - -> 3"
                ];
            }
            product.id = products.length ? products[products.length - 1].id + 1 : 1;
            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            console.error("⛔ 🚨   (ProductMana...) - - > Error al agregar producto:", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("⛔ 🚨   (ProductMana...) - - > Error al leer productos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();           
            const productId = parseInt(id);           
            const product = products.find(p => p.id === productId);
            if (product) {
                console.log(`✔️   (ProductMana...) - - > Producto encontrado: ${product.title}. `);
            } else {
                console.log(`⛔ 🚨   (ProductMana...) - - > Producto no encontrado con ID: ${productId}`);
            }
            return product || null;
        } catch (error) {
            console.error("⛔ 🚨   (ProductMana...) - - > Error al obtener producto por ID:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));

            if (index === -1) {
                return null; // Producto no encontrado
            }

            // Mantiene el ID original y actualiza los demás campos
            products[index] = { ...products[index], ...updatedFields };

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error("⛔ 🚨   (ProductMana...) - - > Error al actualizar producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === parseInt(id));

            if (index === -1) {
                return null; // Producto no encontrado
            }

            // Eliminamos el producto de la lista
            const deletedProduct = products.splice(index, 1)[0];

            // Guardamos la nueva lista en el archivo
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));

            return deletedProduct;
        } catch (error) {
            console.error("⛔ 🚨   (ProductManager) - - > Error al eliminar producto:", error);
            throw error;
        }
    }
}

export default ProductManager;