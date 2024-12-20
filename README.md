# System Requirements

1) Install Node.js: 
Ensure Node.js is installed on your system. You can download and install it from the [official Node.js website.](https://nodejs.org/en)

2) Install MongoDB: 
Download and install MongoDB on your system. Follow the official MongoDB installation guide for your operating system: [MongoDB Installation Documentation](https://www.mongodb.com/docs/manual/installation/).
After installation, ensure MongoDB is running.

3) Install Redis:  
Download and install Redis using the instructions for your operating system: [Redis Installation Guide.](https://redis.io/)
Once installed, start the Redis server


# Installation

You need to write the following commands on the terminal screen so that you can run the project locally.

```sh
1. git clone https://github.com/devpardeepkumar/soar-test.git
2. cd soar-test
3. create .env file and update the variables
4. npm install
5. node app.js
```

The application is running on [localhost:5111](http://localhost:5111).

# Create the user first using createUser API

### For admin user
 ```{ username, email, password, role=[admin], scopes=["admin"]} ```
 
### For school-administrator
 ```{ username, email, password, role=[school-administrator], scopes=["school_read","school_write","class_read","class_write","student_read","student_write"]} ```

### For staff
 ```{ username, email, password, role=[school-administrator], scopes=["school_read","student_read"]} ```

```sh
1. git clone https://github.com/devpardeepkumar/soar-test.git
2. cd soar-test
3. create .env file and update the variables
4. npm install
5. node app.js


# API Endpoints

| Path | Method | Payload 
| ------------------------------------------------------ | -------------------- |-----------------------------------|
| `http://localhost:5111/api/users/createUser`           | POST                 | ```{ username, email, password, role=[admin,school-administrator,staff], scopes=["school_read","school_write","class_read","class_write","student_read","student_write"]} ```
| `http://localhost:5111/api/schools/createSchool`           | POST                 | ```{ name, address, email, shortDesc, longDesc, website, phone} ```|
| `http://localhost:5111/api/schools/updateSchool`           | POST                 | ```{id, name, address, email, shortDesc, longDesc, website, phone} ```|
| `http://localhost:5111/api/schools/deleteSchool`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/schools/getSchoolById`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/schools/getAllSchool`           | POST                 | ```{page=1, limit=10, search} ```|
| `http://localhost:5111/api/classrooms/createClass`           | POST                 | ```{schoolid, capacity, resources, name} ```|
| `http://localhost:5111/api/classrooms/updateClass`           | POST                 | ```{id, schoolid, capacity, resources, name} ```|
| `http://localhost:5111/api/classrooms/getClassById`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/classrooms/deleteClass`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/classrooms/getAllClassess`           | POST                 | ```{page=1, limit=10, search, schoolid} ```|
| `http://localhost:5111/api/students/createStudents`           | POST                 | ```{schoolid, name, lastname, email, dateofbirth, gender, enrollmentdate, classid } ```|
| `http://localhost:5111/api/students/updateStudent`           | POST                 | ```{id, schoolid, name, lastname, email, dateofbirth, gender, enrollmentdate, classid} ```|
| `http://localhost:5111/api/students/getStudentById`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/students/deleteStudent`           | POST                 | ```{id} ```|
| `http://localhost:5111/api/students/getAllStudents`           | POST                 | ```{page=1, limit=10, search, schoolid, classid} ```|
