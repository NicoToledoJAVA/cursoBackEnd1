//ProductDBFiller.js

class ProductDBFiller {
    constructor(manejador) {
        // Instanciamos ProductManager con la ruta del archivo JSON donde se almacenarán los productos
        this.productManager = manejador;
    }

    // Método para llenar el archivo de productos con los datos de ejemplo
    async seedProducts() {
        const products = [
            new Product("Aceite de Ricino Uso Externo \"PF\" 30ml", "Aceite de ricino para uso externo, ideal para el cuidado de la piel y el cabello.", "29", 29, 2900.0, true, 15, "Cuidado Personal"),
            new Product("Aji de Cayena 50g", "Ají de cayena molido, ideal para sazonar comidas con un toque picante.", "36", 36, 894.0, true, 20, "Especias"),
            new Product("Ajo 1000 Garden House 30 Comp", "Suplemento dietario a base de ajo, beneficioso para la salud cardiovascular.", "38", 38, 9082.0, true, 30, "Suplementos"),
            new Product("Algas para Sushi 5u", "Láminas de alga nori para la preparación de sushi y otros platos orientales.", "42", 42, 3120.25, true, 2, "Gastronomía"),
            new Product("Almidón de Maiz Aldema S/TACC 500g", "Almidón de maíz sin TACC, ideal para repostería y cocina sin gluten.", "50", 50, 1174.0, true, 10, "Harinas y Féculas"),
            new Product("Amapola Azul 25g", "Semillas de amapola azul, perfectas para panadería y repostería.", "55", 55, 729.0, true, 150, "Semillas"),
            new Product("Amaranto 100g", "Granos de amaranto, ricos en proteínas y aminoácidos esenciales.", "56", 56, 870.0, true, 130, "Cereales y Granos"),
            new Product("Anis en Grano 25g", "Semillas de anís en grano, utilizadas en infusiones y panadería.", "60", 60, 734.0, true, 180, "Especias"),
            new Product("Aritos de Miel 200g", "Aritos crocantes sabor miel, perfectos para el desayuno o merienda.", "64", 64, 1802.0, true, 160, "Cereales"),
            new Product("Aritos Frutales 200g", "Aritos sabor a frutas, enriquecidos con vitaminas y minerales.", "65", 65, 1989.5, true, 17, "Cereales"),
            new Product("Arroz integral fino 500g", "Arroz integral fino, ideal para una alimentación saludable y equilibrada.", "67", 67, 1125.6, true, 550, "Cereales y Granos"),
            new Product("Avena Arg. Instantanea Premium 500g", "Avena instantánea de alta calidad, ideal para desayunos saludables.", "74", 74, 1773.2, true, 60, "Cereales"),
            new Product("Avena Tradicional Premium 500g", "Avena tradicional sin procesar, ideal para cocinar y hornear.", "78", 78, 1707.2, true, 6, "Cereales"),
            new Product("Bicarbonato de Sodio 200g", "Bicarbonato de sodio de grado alimenticio, útil en cocina y limpieza.", "86", 86, 1600.0, true, 7, "Hogar"),
            new Product("Calcio 500 Garden House 40comp", "Suplemento dietario con calcio, ayuda a fortalecer huesos y dientes.", "94", 94, 8870.0, true, 80, "Suplementos"),
            new Product("Canela en Rama 15g", "Ramas de canela natural, ideales para infusiones y repostería.", "95", 95, 1170.0, true, 15, "Especias"),
            new Product("Canela Molida 50g", "Canela molida fina, perfecta para sazonar postres y bebidas.", "97", 97, 1323.0, true, 10, "Especias"),
            new Product("Caramelo Propoleo Lindon Apiter MENTA", "Caramelos de propóleo con menta, ideales para aliviar la garganta.", "99", 99, 200.26, true, 20, "Dulces y Golosinas"),
            new Product("Caramelo Propoleo Lindon Apiter MIEL", "Caramelos de propóleo con miel, aportan suavidad y alivio para la garganta.", "100", 100, 200.26, true, 30, "Dulces y Golosinas"),
            new Product("Cardo Mariano Tintura Fatima", "Tintura madre de cardo mariano, favorece la salud hepática.", "101", 101, 2160.0, true, 40, "Suplementos"),
            new Product("Cebada Perlada", "Granos de cebada perlada, ideales para guisos y ensaladas.", "106", 106, 1158.0, true, 90, "Cereales y Granos"),
            new Product("Cebolla en escama 50g", "Cebolla deshidratada en escamas, para sazonar todo tipo de platos.", "108", 108, 806.0, true, 80, "Especias"),
            new Product("Centella Asiática Garden House 60comp", "Suplemento de centella asiática, ayuda a mejorar la circulación sanguínea.", "109", 109, 8530.0, true, 110, "Suplementos"),
            new Product("Chia 100g", "Semillas de chía, fuente de omega-3 y fibra.", "113", 113, 692.0, true, 1110, "Semillas"),
            new Product("Chia Caps Garden House 60Comp", "Cápsulas de chía, ricas en ácidos grasos esenciales y antioxidantes.", "115", 115, 16200.0, true, 90, "Suplementos")
        ];

         // Esto da lugar a un Bucle infinito. 
         // Por eso ponemos este método para que sirva como "Centinel"
         // Lo que va a hacer es: Verificar si ya hay productos en la base de datos antes de agregar más.
         const existingProducts = await this.productManager.getProducts();
         if (existingProducts.length > 0) {
             console.log('Los productos ya están en la base de datos. No se agregarán más productos.');
             return;  // Si ya existen productos, no se agrega nada.
         }

        // Recorremos los productos y los agregamos al archivo
        for (const product of products) {
            await this.productManager.addProduct(product);
        }
    }
}

class Product {
    constructor(title, description, code_bar, product_number, price, status, stock, category) {
        this.title = title;
        this.description = description;
        this.code_bar = code_bar;
        this.product_number = product_number; // Es un Number, sin comillas
        this.price = price;
        this.status = status; // Boolean
        this.stock = stock;
        this.category = category;
        this.thumbnails = ["imagen1", "imagen2", "imagen3"];
    }
}





export default ProductDBFiller;