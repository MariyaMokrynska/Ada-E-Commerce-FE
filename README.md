# Ada E-Commerce Site

This is a basic frontend E-Commerce Frontend for Ada Developers Academy's AWS curriculum.

## Pre-Setup
The following three microservices repos will be necessary for it to run effectively:

1. Products Microservice (https://github.com/Ada-Activities/Ada-E-Commerce-Orders-Service)
2. Users Microservice (https://github.com/Ada-Activities/Ada-E-Commerce-User-Service)
3. Orders Microservice (https://github.com/Ada-Activities/Ada-E-Commerce-Orders-Service)

You will also need a pre-signed url lambda function running in AWS. This solution currently works with the pre-signed url solution from the Storage lab. If your lambda has different response bodies or query parameters, you may need to tweak the lambda request in `ProductForm.tsx`

For local testing, the microservices were run on the following ports:

- Users Microservice - `localhost:5000` (VITE_USER_URL)  
- Orders Microservice - `localhost:8000` (VITE_ORDER_URL)
- Products Microservice - `localhost:8080` (VITE_PRODUCT_URL) 

## Setup

1. Fork and Clone this repository.
2. Run the command `npm install` to install the necessary dependencies.
3. Create a `.env` file with the following variables:
   1. VITE_USER_URL (Users Microservice Endpoint)
   2. VITE_ORDER_URL (Orders Microservice Endpoint)
   3. VITE_PRODUCT_URL (Products Microservice Endpoint)
   4. VITE_LAMBDA_URL (Pre-signed URL Lambda Endpoint)
4. Run the command `npm run dev` to test that the application is working.

## Current Functionality

The following functionality should be currently available:

1. Login Page
   1. You will be able to create a new user with a first name, last name, email and the ability to select whether or not the user is an admin.
   2. Once a User has been created, their email can be used to login.
2. Home Page
   1. Admin Users
      1. Admin users will be able to see a list of every product. 
      2. Admin users will be able to update the stock of each product.
      3. Admin users will be able to delete any product.
      4. Admin users will have a form at the bottom where they will be able to add a product.
   2. Non-admin Users
      1. Non-admin users will be able to see a list of every produc.
      2. Non-admin users will be able to change the quantity they would like and add that item to their cart.
3. Orders Page
   1. Admin users will be able to see all orders from all users.
   2. Non-admin users will be able to see only their past orders.
4. Cart Page
   1. Admin users will see an empty cart as they currently do not have cart functionality.
   2. Non-Admin users will see a list of items they currently have in their cart. They will be able to update quantities directly from the cart.
5. Account Page 
   1. All Users will be able to see and update their account information.


## Current Known Issues
1. Users can more pieces of a product than are available.
2. Admin users can see a cart page but have no cart functionality
3. Login is based off email only
4. EDA is not currently implemented when a cart is submitted
5. Styling and testing are limited.


Note: Some elements (including the styling) of this repository were generated using AI. 