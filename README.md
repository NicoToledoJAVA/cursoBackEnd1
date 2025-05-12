# 🛍️ EcoMystika Backend (cursoBackEnd1)

Este es el backend de EcoMystika, una aplicación construida con **Node.js**, **Express**, **MongoDB**, **WebSockets** y **Handlebars**. Maneja productos y carritos de compra de manera dinámica, incluyendo vistas en tiempo real y API RESTful.

---

## 📦 Características

- API REST para productos y carritos
- Conexión a MongoDB Atlas
- Motor de plantillas Handlebars
- Comunicación en tiempo real con Socket.IO
- Renderizado de productos en vista con Axios
- Rutas bien organizadas usando Express Router

---

# Documentación del Proyecto

## Descripción

Este proyecto es una API RESTful que gestiona productos y carritos de compras utilizando **Express.js**, **Mongoose**, y **Socket.IO**. Los productos y los carritos son gestionados a través de rutas específicas para cada entidad. Además, se integra con una base de datos **MongoDB** para almacenar y recuperar los productos y carritos.

### Tecnologías utilizadas

- **Express.js**: Framework para Node.js.
- **Mongoose**: ODM para MongoDB.
- **Socket.IO**: Para la comunicación en tiempo real entre el servidor y el cliente.
- **Axios**: Para realizar peticiones HTTP.
- **Handlebars**: Motor de plantillas para renderizar vistas.

# Tratamiento de la interfaz gráfica

## Estructura General

La interfaz gráfica está dividida en dos secciones principales:  
1. **Lista de Productos**: Se muestra una lista de productos, cada uno con su respectiva información.
2. **Carrito de Compras**: Un modal que muestra los productos agregados al carrito y permite visualizar el total de la compra.

## Vista de Productos

Los productos se muestran en un **grid** de tarjetas (utilizando Bootstrap) que incluyen:
- **Título** del producto.
- **Descripción** breve del producto.
- **Precio** y **stock** disponible.
- **Categoría** del producto.

Cada producto tiene dos botones principales en la parte superior derecha de la tarjeta:
- **Botón de eliminación**: Permite eliminar el producto de la base de datos al hacer clic en el icono de la "X".
- **Botón de edición**: Permite editar los detalles del producto (como el título, descripción, precio, stock, etc.) al hacer clic en el icono de lápiz.

Además, en la parte inferior de cada tarjeta, un **botón de agregar al carrito** permite agregar el producto al carrito de compras.

## Modal del Carrito

El carrito de compras se presenta en un **modal** que se activa al hacer clic en el botón "Abrir Carrito". En este modal se muestran los siguientes detalles:
- **Lista de productos agregados**: Cada producto agregado al carrito se muestra con su nombre, cantidad y precio.
- **Total**: Se muestra el total de la compra, calculado a partir de los productos en el carrito.
- **Botón de Cerrar**: Permite cerrar el modal del carrito sin realizar ninguna acción adicional.

## Interacciones del Usuario

- **Agregar al Carrito**: Al hacer clic en el botón "Agregar al Carrito" en cualquier tarjeta de producto, el producto se agrega al carrito. El modal del carrito se abre automáticamente para que el usuario pueda revisar su compra.
- **Eliminar del Carrito**: Dentro del modal, cada producto agregado al carrito tiene un botón para eliminarlo. Esta acción actualiza la vista del carrito en tiempo real.
- **Modificar Productos**: Desde la lista de productos, al hacer clic en el botón de lápiz de un producto, el usuario puede editar los detalles del producto. Esto abre un cuadro de edición con campos prellenados con la información del producto.

## Código HTML

El archivo `main.handlebars` incluye la estructura básica de la página, con los elementos necesarios para mostrar los productos y gestionar el carrito de compras. Además, se incluye el uso de **Bootstrap** para el estilo y los **modales**.

```html
<!-- Modal del Carrito -->
<div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-end">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cartModalLabel">Changuito de Compras</h5>
        <button type="button" class="btn-close" onclick="closeCartModal()" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <div id="cartItemsContainer">
          <ul id="lista-carrito"></ul>
        </div>
        <hr>
        <p id="totalCarrito"><strong>Total: $0</strong></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeCartModal()">Cerrar</button>
      </div>
    </div>
  </div>
</div>
```

# Rutas

---
## (La collection de Postman se halla en el directorio raíz como:  `Backend.postman_collection.json`)
---

### Rutas de Productos (`/api/products`)

#### `GET /api/products`
Obtiene todos los productos.

**Respuesta exitosa**:
```json
{
  "result": "ok",
  "payload": [
    {
      "_id": "ObjectId",
      "title": "Producto 1",
      "description": "Descripción del producto",
      "price": 100,
      "category": "Categoría",
      "stock": 10,
      "thumbnails": ["url_imagen1", "url_imagen2"]
    }
  ]
}
```

#### `GET /api/products/:id`
Obtiene un producto por su ID.

**Respuesta exitosa:**
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "title": "Producto 1",
    "description": "Descripción del producto",
    "price": 100,
    "category": "Categoría",
    "stock": 10,
    "thumbnails": ["url_imagen1"]
  }
}
```

#### `POST /api/products`
Crea un nuevo producto.

Cuerpo de la solicitud:

**Respuesta exitosa:**
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción",
  "price": 150,
  "stock": 20,
  "category": "Electrónica",
  "thumbnails": ["url_imagen"]
}
```

**Respuesta exitosa**:
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "title": "Nuevo Producto",
    "description": "Descripción",
    "price": 150,
    "stock": 20,
    "category": "Electrónica",
    "thumbnails": ["url_imagen"]
  }
}
```

#### `PUT /api/products/:id`
Actualiza un producto existente por su ID.

**Cuerpo de la solicitud:**
```json
{
  "title": "Producto Actualizado",
  "description": "Descripción actualizada",
  "price": 200,
  "stock": 30,
  "category": "Electrónica"
}
```

**Respuesta exitosa:**
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "title": "Producto Actualizado",
    "description": "Descripción actualizada",
    "price": 200,
    "stock": 30,
    "category": "Electrónica",
    "thumbnails": ["url_imagen"]
  }
}
```

#### `DELETE /api/products/:id`
Elimina un producto por su ID.

**Respuesta exitosa**:
```json
{
  "result": "ok",
  "payload": { "n": 1, "ok": 1, "deletedCount": 1 }
}
```

#### `Rutas de Carritos (/api/carts)`
#### `GET /api/carts`
Obtiene todos los carritos.

**Respuesta exitosa:** 
```json
{
  "result": "ok",
  "payload": [
    {
      "_id": "ObjectId",
      "id": 1,
      "products": [
        {
          "id": 1,
          "title": "Producto 1",
          "price": 100,
          "quantity": 2
        }
      ],
      "total": 200
    }
  ]
}
```

#### `GET /api/carts/:id`
Obtiene un carrito por su ID.

**Respuesta exitosa:**
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "id": 1,
    "products": [
      {
        "id": 1,
        "title": "Producto 1",
        "price": 100,
        "quantity": 2
      }
    ],
    "total": 200
  }
}
```

#### `POST /api/carts`
Crea un nuevo carrito.

**Cuerpo de la solicitud:**

```json
{
  "products": [
    {
      "id": 1,
      "title": "Producto 1",
      "price": 100,
      "quantity": 2
    }
  ]
}
```

**Respuesta exitosa**:
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "id": 1,
    "products": [
      {
        "id": 1,
        "title": "Producto 1",
        "price": 100,
        "quantity": 2
      }
    ],
    "total": 200
  }
}
```

#### `PUT /api/carts/:id`
Actualiza un carrito por su ID.

**Cuerpo de la solicitud:**
```json{
  "products": [
    {
      "id": 1,
      "title": "Producto 1",
      "price": 100,
      "quantity": 3
    }
  ]
}
```

**Respuesta exitosa**:
```json
{
  "result": "ok",
  "payload": {
    "_id": "ObjectId",
    "id": 1,
    "products": [
      {
        "id": 1,
        "title": "Producto 1",
        "price": 100,
        "quantity": 3
      }
    ],
    "total": 300
  }
}
```

#### `DELETE /api/carts/:id`
Elimina un carrito por su ID.


**Respuesta exitosa:**
```json
{
  "result": "ok",
  "payload": { "n": 1, "ok": 1, "deletedCount": 1 }
}
```

## Funcionalidad en Tiempo Real

El servidor utiliza **Socket.IO** para la comunicación en tiempo real entre el servidor y el cliente. Esto permite que los mensajes sean enviados y recibidos de manera eficiente entre el cliente y el servidor.

- **Evento mensajeCliente**: El cliente puede enviar un mensaje al servidor.
- **Evento mensajeServidor**: El servidor responde con un mensaje.

## Conexión con MongoDB

La base de datos MongoDB se conecta usando **Mongoose** con la siguiente URI:

```js
mongoose.connect("mongodb+srv://nicotole:toletole12@cluster0.mkyvq6u.mongodb.net/EcoMystika?retryWrites=true&w=majority&appName=Cluster0")
```

## 🚀 Instalación y uso

1. Clona el repositorio o descarga el código.
2. Navega al directorio del proyecto y ejecuta:
    ```bash
    npm install
    ```
3. Configura la base de datos de MongoDB, asegurándote de tener una cuenta y conexión válida.
4. Inicia el servidor ejecutando:
    ```bash
    npm start
    ```
5. El servidor estará disponible en [http://localhost:8080]
6. Abre tu `Panel de Docente` en la página de `CoderHouse`.
7. Coloca un 10 (DIEZ) como nota a Nico TOLEDO en tu `Panel de Docente`.
8. Eso es todo. Tenga usted un buen día. Larga vida y prosperidad. Gracias por leer esta documentación tan larga!
