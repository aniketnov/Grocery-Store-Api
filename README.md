# Grocery Store Products API

This API allows CRUD operations on categories, subcategories, and products for a grocery store. It also supports nested routes, allowing subcategories to be created under categories and products under subcategories. Image upload functionality is included using Multer. The API is built using Express and MongoDB as the database.

## Features

1. Category Management: Create, read, update, and delete categories.
2. Subcategory Management: Create, read, update, and delete subcategories nested under categories.
3. Product Management: Create, read, update, and delete products nested under subcategories.
4. Image Upload: Upload product images using Multer middleware.
5. Database: MongoDB is used for data storage.
6. Routing: Express is used for route handling, including nested routes for categories and subcategories.

## Routes

### Categories

- **Create Category**: POST /api/categories
- **Get All Categories**: GET /api/categories
- **Get Category by ID**: GET /api/categories/:id
- **Update Category**: PUT /api/categories/:id
- **Delete Category**: DELETE /api/categories/:id

### Subcategories (Nested under Categories)

- **Create Subcategory**: POST /api/categories/:categoryId/subcategories
- **Get All Subcategories**: GET /api/categories/:categoryId/subcategories
- **Get Subcategory by ID**: GET /api/categories/:categoryId/subcategories/:id
- **Update Subcategory**: PUT /api/categories/:categoryId/subcategories/:id
- **Delete Subcategory**: DELETE /api/categories/:categoryId/subcategories/:id

### Products (Nested under Subcategories)

- **Create Product**: POST /api/categories/:categoryId/subcategories/:subcategoryId/products
- **Get All Products**: GET /api/categories/:categoryId/subcategories/:subcategoryId/products
- **Get Product by ID**: GET /api/categories/:categoryId/subcategories/:subcategoryId/products/:id
- **Update Product**: PUT /api/categories/:categoryId/subcategories/:subcategoryId/products/:id
- **Delete Product**: DELETE /api/categories/:categoryId/subcategories/:subcategoryId/products/:id

## Image Upload

Upload Product Image: When creating or updating a product, images can be uploaded using Multer. Add an image field in the form data for the request.

## Technologies Used

Backend: Express.js
Database: MongoDB
Image Upload: Multer

## Usage

Use the API to create categories, subcategories, and products.
Use nested routes to manage subcategories under categories and products under subcategories.
Upload images while creating or updating products by adding the image in the form data.
