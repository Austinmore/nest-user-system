# Project Title

A User-wallet system.

## Description

This project is built using the [Nest](https://github.com/nestjs/nest) framework. It includes features such as JWT-based authentication, user management, and a simple wallet system where users can fund and withdraw money without actual monetary processing.

## Key Features

- User Registration and Authentication using JWT
- CRUD operations for user management
- Wallet functionality for each user to fund and withdraw

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node.js and npm
- You have a PostgreSQL database server running

## Database Setup

To set up a database for this project, follow these steps:

1. Install PostgreSQL if it is not already installed on your machine.
2. Start your PostgreSQL server.
3. Connect to the PostgreSQL command line utility: `psql -U username` (replace `username` with your PostgreSQL username)
4. Create a new database using the SQL command: `CREATE DATABASE your_db_name;` (replace `your_db_name` with your preferred database name)
5. Grant all privileges of the database to your user: `GRANT ALL PRIVILEGES ON DATABASE your_db_name TO username;`
6. Update the `.env` file in your project root with your database connection string:


DATABASE_URL=postgresql://username:password@localhost:5432/your_db_name



(Replace `username`, `password`, and `your_db_name` with your PostgreSQL credentials and database name)

## Installation

1. Clone the repository to your local machine.
2. Navigate into the project directory.
3. Install the required dependencies:
```bash
$ npm install


## Runing the Aplication

$ npm run start:dev



Swagger API Documentation
To view and interact with the API documentation:

Run the application with npm run start:dev.
Navigate to http://localhost:5000/api in your web browser.