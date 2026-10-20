# Final Exam: Internet Programming (2026)
## Topic: HR Manager & Salary Analytics System
**Student ID:** std6730251158  
**Repository:** [Std6730251158IPFinal2026](https://github.com/nontanaphubun/Std6730251158IPFinal2026)  
**Database (phpMyAdmin):** [http://119.59.102.161/nindamdb/](http://119.59.102.161/nindamdb/) (`ip_std6730251158`)

---

## 📁 Project Architecture & Directory Structure

```
Std6730251158IPFinal2026
├── backend/
│   ├── server.js              # Express.js REST API & In-memory data store
│   ├── kmeans.js              # 1D K-Means Clustering Algorithm (k=3)
│   ├── database.sql           # MySQL database schema & mock seed data
│   ├── test_kmeans.js         # Unit tests for K-Means edge cases
│   ├── test_api_endpoints.js  # Integration tests for all CRUD & Auth endpoints
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── App.js                 # Root React Native Component (Auth & Navigation)
│   ├── src/
│   │   ├── config.js          # API base URL configuration
│   │   ├── screens/
│   │   │   ├── LoginScreen.js       # Phase 1: Authentication screen
│   │   │   └── DashboardScreen.js   # Phase 1 & 2: Employee CRUD & Analytics
│   │   ├── components/
│   │   │   ├── AddEmployeeForm.js   # Client-side validated form
│   │   │   ├── EmployeeCard.js      # Status toggle & delete confirmation
│   │   │   └── ClusterSummary.js    # Phase 2: Salary cluster summary cards
│   │   └── utils/
│   │       └── alertPolyfill.js     # Universal alert/confirm for iOS, Android & Web
│   ├── package.json
│   ├── app.json
│   └── .gitignore
└── README.md
```

---

## 🛠️ Phase 1: Authentication & Employee Management (Login & CRUD)

### 1. Backend (Express.js)
- **POST `/api/login`**:
  - Request Body: `{ "username": "admin", "password": "password123" }`
  - Valid: Returns `Status 200 OK` with `{ "success": true, "token": "mock-jwt-token" }`
  - Invalid: Returns `Status 401 Unauthorized` with error message.
- **GET `/api/employees`**:
  - Returns array of mock employee records with schema `{ id, name, position, status, salary }`.
- **POST `/api/employees`**:
  - Validates `name`, `position`, and `salary`.
  - Returns `Status 400 Bad Request` if any required field is empty or missing.
  - Returns `Status 201 Created` with the newly created employee object.
- **PUT `/api/employees/:id/status`**:
  - Toggles employee status between `"Active"` and `"On Leave"`.
  - Returns `Status 404 Not Found` if id does not exist.
- **DELETE `/api/employees/:id`**:
  - Removes the employee record from the server memory.
  - Returns `Status 404 Not Found` if id does not exist.

### 2. Frontend (React Native)
- **Login Screen**:
  - Accepts username and password with client validation.
  - Displays alert notification upon failed authentication.
  - Seamlessly navigates to Dashboard upon success.
- **Dashboard Screen**:
  - Lists all employees with their name, position, status badge, and salary.
  - **Add Employee Form**: Client-side validation prevents submission when fields are empty.
  - **Toggle Status Button**: Live status update with instant UI reflection.
  - **Delete Button**: Prompts confirmation alert dialog (`"Are you sure?"`) before dispatching delete request to API.

---

## 🧠 Phase 2: Automated Salary Clustering (1D K-Means Analytics)

### 1. Backend Algorithm (`kmeans.js`)
- **GET `/api/employees/salary-clusters`**:
  - Extracts current employee salary values.
  - Executes 1D K-Means Clustering ($k = 3$) to classify compensation into 3 tiers:
    - **Tier 1**: Entry / Junior range
    - **Tier 2**: Mid-level range
    - **Tier 3**: Senior / Leadership range
  - Response Format:
    ```json
    {
      "success": true,
      "clusters": [
        { "group": "Tier 1", "centroid": 19250, "count": 2 },
        { "group": "Tier 2", "centroid": 48333, "count": 3 },
        { "group": "Tier 3", "centroid": 86500, "count": 2 }
      ]
    }
    ```
  - Includes full edge-case protection (handles 0 employees, <3 employees, and uniform salaries without crashing).

### 2. Frontend Analytics UI
- **"Analyze Salary Structure" Button** on Dashboard.
- Renders an animated `ActivityIndicator` loading state while waiting for computation.
- Renders summary cards with tier badges, employee counts, average base salaries, and percentage distribution bars.

---

## 🗄️ Database Setup (MySQL / phpMyAdmin)

The database schema and initial records have been created in:
- **Server:** `http://119.59.102.161/nindamdb/`
- **Database:** `ip_std6730251158`
- **Table:** `employees`
- **SQL Backup File:** [`backend/database.sql`](./backend/database.sql)

---

## 🚀 How to Run the Project

### 1. Start the Backend Server (Express.js)
```bash
cd backend
npm install
npm start
```
> Server runs on `http://localhost:5000`.

To run backend automated verification tests:
```bash
node test_api_endpoints.js
```

### 2. Start the Frontend Application (React Native / Expo)
```bash
cd frontend
npm install
npm start
```
- Press **`w`** in the terminal to run immediately in your **Web Browser** (`http://localhost:8081`).
- Or scan the QR code with **Expo Go** on iOS or Android.

---

## 🔑 Demo Credentials
- **Username:** `admin`
- **Password:** `password123`
