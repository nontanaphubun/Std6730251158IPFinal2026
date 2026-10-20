const express = require('express');
const cors = require('cors');
const { kMeans1D } = require('./kmeans');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-Memory Data Store (Initialized with mock employees matching exam requirements)
const INITIAL_EMPLOYEES = [
  {
    id: "1",
    name: "John Doe",
    position: "Software Engineer",
    status: "Active",
    salary: 45000
  },
  {
    id: "2",
    name: "Jane Smith",
    position: "Senior Tech Lead",
    status: "Active",
    salary: 85000
  },
  {
    id: "3",
    name: "Michael Scott",
    position: "Regional Director",
    status: "On Leave",
    salary: 88000
  },
  {
    id: "4",
    name: "Pam Beesly",
    position: "HR Specialist",
    status: "Active",
    salary: 18500
  },
  {
    id: "5",
    name: "Jim Halpert",
    position: "Marketing Manager",
    status: "Active",
    salary: 48000
  },
  {
    id: "6",
    name: "Dwight Schrute",
    position: "Operations Lead",
    status: "Active",
    salary: 52000
  },
  {
    id: "7",
    name: "Kevin Malone",
    position: "Junior Accountant",
    status: "On Leave",
    salary: 20000
  }
];

// Deep copy of initial employees
let employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
let nextId = 8;

// Health / Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: "HR Manager & Salary Analytics API is running.",
    student: "std6730251158",
    exam: "Internet Programming Final 2026"
  });
});

// ==========================================
// Phase 1: Authentication
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(401).json({
      success: false,
      message: "Username and password are required."
    });
  }

  if (username === 'admin' && password === 'password123') {
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token"
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials. Please enter admin and password123."
    });
  }
});

// ==========================================
// Phase 1: Employee Management (CRUD)
// ==========================================

// [GET] /api/employees - Return all employee records
app.get('/api/employees', (req, res) => {
  res.status(200).json(employees);
});

// [POST] /api/employees - Add a new employee
app.post('/api/employees', (req, res) => {
  const { name, position, salary, status } = req.body || {};

  // Validation: If any required field is empty, respond with Status 400 Bad Request
  if (
    name === undefined || name === null || String(name).trim() === '' ||
    position === undefined || position === null || String(position).trim() === '' ||
    salary === undefined || salary === null || String(salary).trim() === ''
  ) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: Name, position, and salary fields are required and cannot be empty."
    });
  }

  const numericSalary = Number(salary);
  if (isNaN(numericSalary) || numericSalary < 0) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: Salary must be a valid non-negative number."
    });
  }

  const newEmployee = {
    id: String(nextId++),
    name: String(name).trim(),
    position: String(position).trim(),
    status: status === "On Leave" ? "On Leave" : "Active",
    salary: numericSalary
  };

  employees.push(newEmployee);

  res.status(201).json({
    success: true,
    message: "Employee added successfully.",
    data: newEmployee
  });
});

// [PUT] /api/employees/:id/status - Toggle employee status (Active <-> On Leave)
app.put('/api/employees/:id/status', (req, res) => {
  const { id } = req.params;
  const employee = employees.find(e => e.id === String(id));

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: `Employee with id ${id} not found.`
    });
  }

  // Toggle status
  employee.status = employee.status === "Active" ? "On Leave" : "Active";

  res.status(200).json({
    success: true,
    message: `Status toggled to ${employee.status}`,
    data: employee
  });
});

// [DELETE] /api/employees/:id - Remove employee from the system
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(e => e.id === String(id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Employee with id ${id} not found.`
    });
  }

  const removed = employees.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Employee ${removed.name} removed successfully.`,
    data: removed
  });
});

// ==========================================
// Phase 2: Automated Salary Clustering (K-Means)
// ==========================================

// [GET] /api/employees/salary-clusters
app.get('/api/employees/salary-clusters', (req, res) => {
  try {
    // Extract only salary values from all current employees
    const salaries = employees.map(e => Number(e.salary));

    // Run 1D K-Means clustering (k=3)
    const clusters = kMeans1D(salaries, 3);

    res.status(200).json({
      success: true,
      clusters: clusters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error computing salary clusters: " + error.message
    });
  }
});

// Optional reset route for examiners during grading
app.post('/api/reset', (req, res) => {
  employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
  nextId = 8;
  res.status(200).json({
    success: true,
    message: "Data reset to initial state.",
    employees
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
