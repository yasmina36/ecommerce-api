# E-Commerce API

RESTful e-commerce API built with Node.js, Express.js, MongoDB, and Mongoose. It provides category, product, cart, and order endpoints with filtering, session-based cart persistence, checkout, centralized error handling, and ready-to-import Postman files for local testing.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Main Features

- Categories API
- Products API with filtering
- Persistent session-based Cart API
- Orders and checkout flow
- Centralized error handling
- Postman collection and environment

## Prerequisites

- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection string
- npm

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
```

2. Move into the project folder:

```bash
cd ecommerce-api
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root and add the required variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

5. Seed the database:

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

Base URL:

```text
http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Port used by the Express server |
| `NODE_ENV` | Yes | Runtime environment such as `development` or `production` |
| `MONGO_URI` | Yes | MongoDB connection string |

## Project Structure

```text
ecommerce-api/
|-- config/
|   `-- config.js
|-- controllers/
|   |-- cart.controller.js
|   |-- category.controller.js
|   |-- order.controller.js
|   `-- product.controller.js
|-- db/
|   `-- connect.js
|-- middleware/
|   `-- errorHandler.js
|-- models/
|   |-- cart.model.js
|   |-- Category.model.js
|   |-- order.model.js
|   `-- product.model.js
|-- postman/
|   |-- E-Commerce-API.postman_collection.json
|   `-- E-Commerce-API-Dev.postman_environment.json
|-- routes/
|   |-- cart.routes.js
|   |-- category.routes.js
|   |-- order.routes.js
|   `-- product.routes.js
|-- utils/
|   |-- appError.js
|   `-- asyncHandler.js
|-- .env
|-- .env.example
|-- .gitignore
|-- app.js
|-- package.json
|-- README.md
|-- seed.js
`-- server.js
```

Folder explanation:

- `config/`: application configuration such as `PORT`, `NODE_ENV`, and `MONGO_URI`
- `controllers/`: request handlers for categories, products, cart, and orders
- `db/`: MongoDB connection setup
- `middleware/`: shared middleware such as centralized error handling
- `models/`: Mongoose schemas and models
- `postman/`: Postman collection and environment files
- `routes/`: Express route definitions
- `utils/`: reusable helpers such as `AppError` and async wrapper logic

## API Endpoints

### Categories

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `http://localhost:3000/api/categories` | Get all categories |
| `GET` | `http://localhost:3000/api/categories/:id` | Get one category by ID |
| `POST` | `http://localhost:3000/api/categories` | Create a category |
| `PATCH` | `http://localhost:3000/api/categories/:id` | Update a category |
| `DELETE` | `http://localhost:3000/api/categories/:id` | Delete a category |

### Products

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `http://localhost:3000/api/products` | Get all products |
| `GET` | `http://localhost:3000/api/products/:id` | Get one product by ID |
| `POST` | `http://localhost:3000/api/products` | Create a product |
| `PATCH` | `http://localhost:3000/api/products/:id` | Update a product |
| `DELETE` | `http://localhost:3000/api/products/:id` | Delete a product |

Filtering examples:

```http
GET http://localhost:3000/api/products?category=<categoryId>
GET http://localhost:3000/api/products?minPrice=20&maxPrice=1000
GET http://localhost:3000/api/products?inStock=true&search=book
GET http://localhost:3000/api/products?category=<categoryId>&minPrice=20&maxPrice=1000&inStock=true&search=book
```

### Cart

Cart requests require this header:

```http
x-session-id: user-1
```

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `http://localhost:3000/api/cart` | Get the current session cart |
| `DELETE` | `http://localhost:3000/api/cart` | Clear the current session cart |
| `POST` | `http://localhost:3000/api/cart/items` | Add an item to the current session cart |
| `PATCH` | `http://localhost:3000/api/cart/items/:productId` | Update a cart item quantity for the current session cart |
| `DELETE` | `http://localhost:3000/api/cart/items/:productId` | Remove an item from the current session cart |

### Orders

Checkout requires this header:

```http
x-session-id: user-1
```

| Method | URL | Description |
| --- | --- | --- |
| `POST` | `http://localhost:3000/api/orders` | Checkout the current session cart and create an order |
| `GET` | `http://localhost:3000/api/orders` | Get all orders |
| `GET` | `http://localhost:3000/api/orders/:id` | Get one order by ID |
| `PATCH` | `http://localhost:3000/api/orders/:id/status` | Update an order status |

Current checkout `shippingAddress` format:

```json
{
  "shippingAddress": {
    "street": "10 Main Street",
    "city": "Cairo",
    "country": "Egypt"
  }
}
```

Current status update example:

```json
{
  "status": "confirmed"
}
```

## Postman

Included files:

- `postman/E-Commerce-API.postman_collection.json`
- `postman/E-Commerce-API-Dev.postman_environment.json`

Import steps:

1. Open Postman.
2. Import `postman/E-Commerce-API.postman_collection.json`.
3. Import `postman/E-Commerce-API-Dev.postman_environment.json`.
4. Select the `E-Commerce API Dev` environment.
5. Confirm `baseUrl` is `http://localhost:3000`.
6. Use the default `sessionId` value or change it as needed for another cart session.
7. Set `categoryId`, `productId`, and `orderId` after creating records.

## Notes

- The project does not use authentication or JWT.
- The project does not use `paymentMethod`.
- Cart and checkout remain session-based through the `x-session-id` header.
- Order totals are always calculated server-side.
