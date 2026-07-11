# E-Commerce API

RESTful e-commerce API built with Node.js, Express, and MongoDB. The project provides category, product, cart, and order modules with centralized error handling, MongoDB seeding, dynamic product filtering, and Postman documentation for local testing.

## Features

- Categories CRUD with unique names, generated slugs, and timestamps
- Products CRUD with category references, stock tracking, and filtering
- Single-cart workflow with quantity updates, stock validation, and total recalculation
- Order checkout that copies product snapshots, decrements stock, and clears the cart
- Centralized error handling for validation errors, cast errors, duplicate values, and unknown failures
- Seed script for loading sample categories and products
- Postman collection and environment for local API testing

## Technology Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- dotenv
- express-mongo-sanitize
- nodemon

## API Modules

- Categories
- Products
- Cart
- Orders

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB connection string

## Installation

### Clone the repository

```bash
git clone <your-repository-url>
cd ecommerce-api
```

### Install dependencies

```bash
npm install
```

### Create and configure `.env`

1. Copy `.env.example` to `.env`.
2. Set the values for the environment variables below.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | Port used by the Express server |
| `NODE_ENV` | Yes | Runtime environment such as `development` or `production` |
| `MONGO_URI` | Yes | MongoDB connection string |

Example:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

## Running the Project

### Seed the database

```bash
npm run seed
```

### Run in development mode

```bash
npm run dev
```

### Run in production mode

```bash
npm start
```

## Project Structure

```text
ecommerce-api/
|-- controllers/
|   |-- cart.controller.js
|   |-- category.controller.js
|   |-- order.controller.js
|   `-- product.controller.js
|-- middleware/
|   `-- errorHandler.js
|-- models/
|   |-- Category.model.js
|   |-- cart.model.js
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
|-- .env.example
|-- .gitignore
|-- app.js
|-- package.json
|-- README.md
|-- seed.js
`-- server.js
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/:id` | Get one category by ID |
| `POST` | `/api/categories` | Create a category |
| `PATCH` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get one product by ID |
| `POST` | `/api/products` | Create a product |
| `PATCH` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `POST` | `/api/cart/items` | Add an item to the cart |
| `PATCH` | `/api/cart/items/:productId` | Update a cart item quantity |
| `DELETE` | `/api/cart/items/:productId` | Remove an item from the cart |
| `GET` | `/api/cart` | Get the current cart |
| `DELETE` | `/api/cart` | Clear the cart |
| `POST` | `/api/orders` | Checkout the cart and create an order |
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/:id` | Get one order by ID |
| `PATCH` | `/api/orders/:id/status` | Update an order status |

## Product Filtering Examples

```http
GET /api/products?category=<categoryId>
GET /api/products?minPrice=20&maxPrice=1000
GET /api/products?inStock=true&search=book
GET /api/products?category=<categoryId>&minPrice=20&maxPrice=1000&inStock=true&search=book
```

Supported query parameters:

- `category`
- `minPrice`
- `maxPrice`
- `inStock`
- `search`

## Example Request Bodies

### Create category

```json
{
  "name": "Books",
  "description": "Printed books, eBooks, and reading accessories"
}
```

### Create product

```json
{
  "name": "Node.js Design Patterns",
  "description": "A practical guide to scalable Node.js applications",
  "price": 49.99,
  "stock": 25,
  "category": "<categoryId>",
  "images": [
    "https://example.com/images/nodejs-design-patterns-front.jpg"
  ]
}
```

### Add item to cart

```json
{
  "productId": "<productId>",
  "quantity": 2
}
```

### Create order

```json
{
  "shippingAddress": "123 Tahrir Street, Cairo, Egypt"
}
```

## Example Responses

### Success response

```json
{
  "success": true,
  "data": {
    "_id": "687112233445566778899001",
    "name": "Books",
    "description": "Printed books, eBooks, and reading accessories",
    "slug": "books"
  }
}
```

### Error response

```json
{
  "success": false,
  "message": "Category not found"
}
```

## Validation and Error Handling

- Mongoose schema validation is used for required fields, minimum values, enums, trimming, and unique category names.
- `AppError` is used for operational API errors such as missing resources and invalid business rules.
- The centralized error handler returns structured JSON for validation errors, invalid MongoDB IDs, duplicate values, and unexpected server errors.
- Unknown routes are handled after route registration and return a `404` JSON response.
- `express-mongo-sanitize` is enabled after JSON parsing to strip dangerous MongoDB operators from request payloads.

## Postman

The project includes a ready-to-import Postman collection and environment:

- `postman/E-Commerce-API.postman_collection.json`
- `postman/E-Commerce-API-Dev.postman_environment.json`

Import steps:

1. Open Postman.
2. Import the collection file.
3. Import the environment file.
4. Select the `E-Commerce API Dev` environment.
5. Set `categoryId`, `productId`, and `orderId` after creating records.

## Notes

- The API does not include authentication because it is not part of the current project scope.
- Cart behavior is currently single-cart based and not tied to users.
- Order totals and stock updates are always calculated server-side.
