# Grocery Store Products API

This API allows CRUD operations on categories, subcategories, and products for a grocery store. It includes JWT-based authentication for user access control and supports functionalities for creating new users, password reset, and password forget via email using Nodemailer. Image upload functionality is included using Multer, and MongoDB is used as the database.

## Features

**User Management:** Create new users, login, forget password, and reset password functionality.

**JWT Authorization:** Protect routes using JWT, allowing only authorized users to access certain endpoints.

**Category Management:** Create, read, update, and delete categories.

**Subcategory Management:** Create, read, update, and delete subcategories nested under categories.

**Product Management:** Create, read, update, and delete products nested under subcategories.

**Image Upload:** Upload product images using Multer middleware.

**Database:** MongoDB is used for data storage.

**Routing:** Express is used for route handling, including nested routes for categories and subcategories.

**Email Functionality:** Send password reset emails using Nodemailer.

## Routes

#### Authentication & User Management

- **Sign Up**: POST /api/users/signup
- **Log In**: POST /api/users/login
- **Forget Password**: POST /api/users/forgotPassword
- **Reset Password**: POST /api/users/resetPassword/:token

### Categories

#### (cn = categories Name)

- **Create Category**: POST /api/cn
- **Get All Categories**: GET /api/cn
- **Get Category by ID**: GET /api/cn/:id
- **Update Category**: PUT /api/cn/:id
- **Delete Category**: DELETE /api/cn/:id

### Subcategories (Nested under Categories)

#### sn = subcategories Name

- **Create Subcategory**: POST /api/cn/:categoryId/sn
- **Get All Subcategories**: GET /api/cn/:categoryId/sn
- **Get Subcategory by ID**: GET /api/cn/:categoryId/sn/:id
- **Update Subcategory**: PUT /api/cn/:categoryId/sn/:id
- **Delete Subcategory**: DELETE /api/cn/:categoryId/sn/:id

### Products (Nested under Subcategories)

#### prn = product Name

- **Create Product**: POST /api/sn/:subcategoryId/prn
- **Get All Products**: GET /api/sn/:subcategoryId/prn
- **Get Product by ID**: GET /api/sn/:subcategoryId/prn/:id
- **Update Product**: PUT /api/sn/:subcategoryId/prn/:id
- **Delete Product**: DELETE /api/sn/:subcategoryId/prn/:id

### Products (used for filtering)

- **Get All Products**: GET /api/prn
- **Get Product by ID**: GET /api/prn/:id
- **Update Product**: PUT /api/prn/:id
- **Delete Product**: DELETE /api/prn/:id

## Image Upload

Upload Product Image: When creating or updating a product, images can be uploaded using Multer. Add an image field in the form data for the request.

## Authorization

JWT-based authorization is used to protect routes. Use the token from the login response and pass it in the Authorization header (Bearer token) to access protected routes.

## Role-based Access Control (RBAC)

**Admin-Only Access**: Some routes may be restricted to admin users.
**User-Only Access**: Standard users can access certain routes.

## Technologies Used

**Backend**: Express.js
**Database**: MongoDB
**Image Upload**: Multer
**Authentication**: JWT (JSON Web Token)
**Email**: Nodemailer (for password reset emails)

## Usage

**User Authentication**: Sign up and login using the respective routes. Use the token to access protected routes.
**Category, Subcategory, Product Management**: Use nested routes to manage categories, subcategories, and products.
**Password Management**: Users can request a password reset token via email and reset their password using the provided token.
