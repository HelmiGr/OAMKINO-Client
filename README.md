# Advanced Web Applications Project Group 2 

## Table of Contents 
- [Introduction](#introduction) 
- [Features](#features) 
- [Installation](#installation) 
- [Usage](#usage) 
- [Contributing](#contributing) 

---

## Introduction 
This project is a movie application aimed at movie enthusiasts, offering a platform to discover films, explore showtimes, and connect with like-minded people. 

Users can sign up, log in, search for movies, and browse groups. Once logged in, they can join or create groups to share movie experiences, link movies and showtimes, and engage with their peers. Additionally, users can favourite movies and display them on their profile.


GitHub backend: https://github.com/HelmiGr/OAMKINO-Server  
GitHub frontend: https://github.com/HelmiGr/OAMKINO-Client 


---

## Features 
The frontend is built with React, using JavaScript, JSX, HTML, and CSS. It communicates with the backend using Axios. The backend is developed with Node.js and the Express framework and uses JavaScript and SQL. PostgreSQL serves as the relational database, connected through the pg (node-postgres) library. Security is managed with JSON Web Tokens for user sessions and dotenv for environment variables. 

The database structure consists of five tables: Users stores user information, Groups contains data about groups, GroupMemberships manages user-group relationships and roles, Reviews holds user feedback on movies, and Favorites tracks each user's favourite movies. 


---

## Installation  
For local installation follow these instructions: 

1. **Ensure that Git is installed**  
   - Check using:  ```git --version```
   - If not installed, download console git from https://git-scm.com  

2. **Clone the respository**
   - Create folders for the backend and frontend: ```mkdir app_backend app_frontend```
   - Navigate to each folder and clone the respective repositories
      - Backend: “https://github.com/HelmiGr/OAMKINO-Server” 
      - Frontend: “https://github.com/HelmiGr/OAMKINO-Client” 

3. **Install dependencies**
   - Run “npm install” in the project directories of both files 


---

## Usage
1. **Start the server**
   - Start the server with ```npm run devStart``` 

2. **Start the client**
   - Use ```npm run start``` to start the client 
   - Open the application at “localhost:3000” unless it starts automatically 

3. **Set up the database**
   - Ensure PostgreSQL is installed using ```psql --version``` 
   - If not, visit https://www.postgresql.org/download/ and download it  
   - Use the code in the web_app.sql file (found in the database folder) to set up the database 
   - Create a .env file in the backend directory using the following format: 
        ```
        DB_NAME = (database name) 
        DB_HOST = localhost 
        DB_PORT = (your port) 
        DB_USER = (your username) 
        DB_PASSWORD = (your password) 
        DB_DATABASE = (your database name)
        ```       


---

## Contributing

There are six of us in this team: Enni Ojajärvi, Tobias Müller, Ruwani Vidanachchi, Ha Nguyen, Tanvir Ahammed, and Helmi Griffiths. We have all contributed to the stylistic aspects of the application as well as the functionalities. 

Working as a team has had its difficulties, especially regarding communication about what each person has been doing. Overall, it has been a good learning experience that helped us develop both our coding skills and our teamwork.  