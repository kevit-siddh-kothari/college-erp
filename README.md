# College ERP System

## Description

The College ERP System is a backend-focused project developed using TypeScript and Node.js. The system includes comprehensive authentication and authorization features for different user roles, including `admin` and `staff member`. The project flow is as follows:

1. **User Signup:**  
   Users must first sign up.

2. **User Login:**  
   Upon logging in, an authorization token is generated.

3. **Department Creation (Admin Only):**  
   An authorized user with the `admin` role can create departments.

4. **Batch Creation:**  
   Batches are created within specific departments.

5. **Student Management:**

   - Students are created within specific batches and departments.
   - Upon creating a student, the system automatically adjusts seat availability in the relevant batch.

6. **Attendance Management:**

   - Attendance for students can be triggered as required.
   - Deleting a student will also remove their associated attendance records, and batch/seat availability will be updated.

7. **Batch Deletion:**

   - Deleting a batch will remove all students associated with that batch.

8. **Department Deletion:**
   - Deleting a department will remove the department from all associated batches and delete all students within those batches.

---

## Features

- Authentication and Authorization (Admin and Staff roles)
- Department, Batch, and Student Management
- Attendance Tracking
- Dynamic Seat Adjustment
- Cascade Deletion (Students, Batches, Departments)

## Technologies Used

- **Backend:** Node.js, Express.js, Mongoose
- **Language:** TypeScript
- **Database:** MongoDB

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kevit-siddh-kothari/college-erp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd college-erp
   ```

3. Install dependencies:

   ```bash
   npm install or npm i (node version used is 22)
   ```

4. Create a `.env` file in the root directory and add your environment variables:

   ```bash
   PORT=your port
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation (Export Postman Collection in you project)

### Authentication

1. **Signup User**

   - **Endpoint:** `POST {{college}}/api/user/signup`
   - **Description:** Registers a new user (admin or staff).
   - **Authorization:** Not required.
   - **Body Parameters:**
     - `username` (string, required)
     - `password` (string, required)
     - `role` (string, required) - Role can be `admin` or `staff`.

2. **Login User**

   - **Endpoint:** `POST {{college}}/api/user/login`
   - **Description:** Authenticates the user and returns a token.
   - **Authorization:** Not required.
   - **Body Parameters:**
     - `username` (string, required)
     - `password` (string, required)

3. **Logout User**

   - **Endpoint:** `POST {{college}}/api/user/logout`
   - **Description:** Logs out the user from the current device.
   - **Authorization:** Bearer Token required.
   - **Body Parameters:** None

4. **Logout from All Devices**

   - **Endpoint:** `POST {{college}}/api/user/logoutall`
   - **Description:** Logs out the user from all devices.
   - **Authorization:** Bearer Token required.
   - **Body Parameters:** None

### Student Management

1. **Add Student**

   - **Endpoint:** `POST {{college}}/api/students/add-student`
   - **Description:** Adds a new student to the database.
   - **Authorization:** Bearer Token required (Admin or Staff).
   - **Body Parameters:**
     - `name` (string, required)
     - `phno` (string, required)
     - `departmentname` (string, required)
     - `batch` (string, required)
     - `currentsem` (number, required)

2. **Get All Students**

   - **Endpoint:** `GET {{college}}/api/students/all-students`
   - **Description:** Retrieves all students.
   - **Authorization:** Bearer Token required.

3. **Get Analytics Data**

   - **Endpoint:** `GET {{college}}/api/students/getanalytics`
   - **Description:** Retrieves analytical data on student performance.
   - **Authorization:** Bearer Token required.

4. **Get Absent Students**

   - **Endpoint:** `GET {{college}}/api/students/absent/:date?batch=&branch=ce&currentsem`
   - **Description:** Retrieves a list of students who were absent on a specific date.
   - **Authorization:** Bearer Token required.
   - **Query Parameters:**
     - `batch` (string, optional)
     - `branch` (string, optional)
     - `currentsem` (number, optional)
   - **Path Variables:**
     - `date` (ISO date, required)

5. **Get Students with Attendance Less Than 75%**

   - **Endpoint:** `GET {{college}}/api/students/presentlessthan75`
   - **Description:** Retrieves a list of students whose attendance is less than 75%.
   - **Authorization:** Bearer Token required.

6. **Get Vacant Seats**

   - **Endpoint:** `GET {{college}}/api/students/vacantseats?batch=2024&branch=it`
   - **Description:** Retrieves the number of vacant seats for a particular batch and branch.
   - **Authorization:** Bearer Token required.
   - **Query Parameters:**
     - `batch` (string, required)
     - `branch` (string, required)

7. **Update Student**

   - **Endpoint:** `PUT {{college}}/api/students/update-student/:id`
   - **Description:** Updates the details of a specific student.
   - **Authorization:** Bearer Token required (Admin or Staff).
   - **Path Variables:**
     - `id` (string, required)
   - **Body Parameters:**
     - `phno` (string, optional)

8. **Delete Student by ID**

   - **Endpoint:** `DELETE {{college}}/api/students/delete-student/:id`
   - **Description:** Deletes a student by ID.
   - **Authorization:** Bearer Token required (Admin or Staff).
   - **Path Variables:**
     - `id` (string, required)

9. **Delete All Students**

   - **Endpoint:** `DELETE {{college}}/api/students/deleteall-students`
   - **Description:** Deletes all students from the database.
   - **Authorization:** Bearer Token required (Admin or Staff).

### Department Management

1. **Add Department**

   - **Endpoint:** `POST {{college}}/api/departments/add-department`
   - **Description:** Adds a new department.
   - **Authorization:** Bearer Token required (Admin only).
   - **Body Parameters:**
     - `departmentname` (string, required)

2. **Get All Departments**

   - **Endpoint:** `GET {{college}}/api/departments/all-department`
   - **Description:** Retrieves all departments.
   - **Authorization:** Bearer Token required.

3. **Update Department**

   - **Endpoint:** `PUT {{college}}/api/departments/update-department/:id`
   - **Description:** Updates the details of a specific department.
   - **Authorization:** Bearer Token required (Admin only).
   - **Path Variables:**
     - `id` (string, required)
   - **Body Parameters:**
     - `departmentname` (string, required)

4. **Delete Department by ID**

   - **Endpoint:** `DELETE {{college}}/api/departments/delete-department/:id`
   - **Description:** Deletes a department by ID.
   - **Authorization:** Bearer Token required (Admin only).
   - **Path Variables:**
     - `id` (string, required)

5. **Delete All Departments**

   - **Endpoint:** `DELETE {{college}}/api/departments/deleteall-department`
   - **Description:** Deletes all departments from the database.
   - **Authorization:** Bearer Token required (Admin only).

### Batch Management

1. **Add Batch**

   - **Endpoint:** `POST {{college}}/api/batch/add-batch`
   - **Description:** Adds a new batch within a department.
   - **Authorization:** Bearer Token required (Admin only).
   - **Body Parameters:**
     - `year` (number, required)
     - `totalStudentsIntake` (number, required)
     - `availableSeats` (number, required)
     - `occupiedSeats` (number, required)
     - `department` (string, required)

2. **Get All Batches**

   - **Endpoint:** `GET {{college}}/api/batch/get-allbatch`
   - **Description:** Retrieves all batches.
   - **Authorization:** Bearer Token required.

### Attendance Management

1. **Add Attendance**

   - **Endpoint:** `POST {{college}}/api/attendance/add-attendance/:id`
   - **Description:** Records attendance for a specific student.
   - **Authorization:** Bearer Token required (Admin or Staff).
   - **Path Variables:**
     - `id` (string, required)
   - **Body Parameters:**
     - `isPresent` (boolean, required)

2. **Get All Attendance**

   - **Endpoint:** `GET {{college}}/api/attendance/all-attendance`
   - **Description:** Retrieves all attendance records.
   - **Authorization:** Bearer Token required.

3. **Update Attendance**

   - **Endpoint:** `PUT {{college}}/api/attendance/update-attendance/:id/:date`
   - **Description:** Updates attendance for a specific student on a specific date.
   - **Authorization:** Bearer Token required (Admin or Staff).
   - **Path Variables:**
     - `id` (string, required)
     - `date` (ISO date, required)
   - **Body Parameters:**
     - `isPresent` (boolean, required)
