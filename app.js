const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());


// MySQL connection settings
const connection = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12677771',
    password: 'u9VlLcRdu3',
    database: 'sql12677771'
});

connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to database');
  });
  

app.get('/restaurants', (req, res) => {
    const query = 'SELECT * FROM Restaurants';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.get('/restaurants/:id', (req, res) => {
    const restaurantId = req.params.id;
    const query = 'SELECT * FROM Restaurants WHERE restaurant_id = ?';
    connection.query(query, [restaurantId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(results[0]);
    });
});


app.post('/reservations', (req, res) => {
    const { slot_id, customer_id, customer_name, contact_number, booking_date, num_guests } = req.body;

    if (!slot_id || !customer_id || !customer_name || !contact_number || !booking_date || !num_guests) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO Bookings (slot_id, customer_id, customer_name, contact_number, booking_date, num_guests) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [slot_id, customer_id, customer_name, contact_number, booking_date, num_guests], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Reservation created successfully', booking_id: result.insertId });
    });
});


app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).send('Name, email, and password are required.');
    }
  
    const query = 'INSERT INTO Customers (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
  
    connection.query(query, [name, email, password], (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send('User registered successfully!');
      }
    });
  });


app.get('/login', (req, res) => {
    const query = 'SELECT * FROM Customers';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/viewReservations', (req, res) => {
    const query = 'SELECT * FROM Bookings';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
