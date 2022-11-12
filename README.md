# Simple Login and Signup API in JavaScript

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Mongodb](https://img.shields.io/badge/mongodb-6DA55F?style=for-the-badge&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)


API was **developed** using a well defined and decoupled architecture, using **TDD** as a working methodology and **Clean Architecture**  the distribution of responsibilities in layers, and whenever possible using the principles of **SOLID **.

Requirements

- Node
- npm
- Mongodb

Clone the project and run the `npm install` command to install the dependencies.

~~~javascript
npm install
~~~

Bring up the development server using the `npm run dev` command

~~~javascript
npm run dev
~~~

Configure environment variables by creating a `.env` file in the project root, and following the example of the `.env.example` file.


## Teste

#### run all tests

~~~javascript
npm test
~~~

#### Run unit tests

~~~javascript
npm run test:unit
~~~

#### Run integration tests

~~~javascript
npm run test:integration
~~~

#### Run covarage tests

~~~javascript
npm run test:ci
~~~

## Main features
- Signup
- Login

## Application endpoints

## Signup Route
~~~javascript
[POST] /api/signup
~~~

## **Request body**
~~~javascript
{
   "username": "string",
   "email": "string",
   "password": "string",
   "confirmPassword": "string"
}
~~~

## **Responses**
![Generic badge](https://img.shields.io/badge/OK-200-<COLOR>.svg)

~~~javascript
{
    "access_token": "string",
    "username": "string"
}
~~~
![Generic badge](https://img.shields.io/badge/bad%20request-400-red)

~~~javascript
{
    "error": "string"
}
~~~

## Login Route
~~~javascript
[POST] /api/login
~~~

## **Request body**
~~~javascript
{
  "email": "string",
  "password": "string"
}
~~~

## **Responses**
![Generic badge](https://img.shields.io/badge/OK-200-<COLOR>.svg)

~~~javascript
{
    "access_token": "string",
    "username": "string"
}
~~~
![Generic badge](https://img.shields.io/badge/bad%20request-400-red)

~~~javascript
{
    "error": "string"
}
~~~