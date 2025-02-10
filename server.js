const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change to your MySQL username
  password: "Yahya@sql20", // Change to your MySQL password
  database: "food_orders",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    throw err;
  }
  console.log("Connected to MySQL");
});

// API to save orders with Lucky Token ID
app.post("/submit-order", (req, res) => {
  const { id, category, items } = req.body;
  if (!id || !items.length) {
    return res.status(400).send({ message: "Invalid data" });
  }

  // Prepare order values
  const values = items.map((item) => [id, category, item.name, item.quantity]);

  console.log("Inserting Order:", values);

  const sql = "INSERT INTO orders (lucky_token, category, food_item, quantity) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).send({ message: "Error placing order" });
    }
    res.send({ message: `Order placed successfully! Your Lucky Token is ${id}` });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
