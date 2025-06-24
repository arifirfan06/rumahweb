# Project Setup
1. First download the code or git clone the code
2. go to terminal in the code directory 
3. then run "npm install" to install all dependency in the app
4. after that you need to set up database

## Set Up Database
1. first run "mysql -u root -p"
2. run this command: CREATE DATABASE rumahweb;

USE rumahweb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

3. the command will create database and table. now you are ready to run the app

## Running the app
1. go to your project directory. after npm install, you can do npm run dev or yarn dev
2. now check the terminal, if your terminal output like this: Rumahweb app listening on port 3000
Connected to MySQL. then the app has started. you can explore the api now.

## The API
1. curl http://localhost:3000/users (need bearer token) 
GET /users
Content-Type: application/json
Authorization: Bearer <your_token_here>
3. (login) POST http://localhost:3000/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
3. 
