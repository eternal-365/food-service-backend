const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yahya@sql20", // Change this if needed
    database: "food_orders"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// Helper function to get category based on item name
function getCategory(foodItem) {
    const tiffins = ["Idly", "Dosa", "Puri", "Bonda"];
    const drinks = ["Tea", "Coffee", "Thumbs Up", "coca cola", "Maaza", "Pulpy Orange"];
    const veglunch = ["veg fried rice","veg noodles","veg munchriya","veg meals"]
    const nonveglunch = ["Chicken fried rice","Chicken noodles","Chicken munchriya","nonveg meals","egg fried rice","egg noodles"]


    if (tiffins.includes(foodItem)) return "Tiffins";
    
    if (veglunch.includes(foodItem)) return "veglunch";
    if (nonveglunch.includes(foodItem)) return "nonveglunch";
    if (drinks.includes(foodItem)) return "Drinks";
    return "Unknown";
}

// Order Submission Route
app.post("/submit-order", (req, res) => {
    const { order_items } = req.body; 

    if (!order_items || order_items.length === 0) {
        return res.status(400).json({ error: "Please select at least one item." });
    }

    const luckyToken = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit lucky token

    // Prepare data for insertion
    let values = order_items.map(item => [
        luckyToken,
        getCategory(item.name),
        item.name,
        item.quantity,
        req.body.pickup_time  // Add pickup time to the values
    ]);
    
    // Update the SQL query to include pickup_time
    const sql = "INSERT INTO orders (lucky_token, category, food_item, quantity, pickup_time) VALUES ?";
    db.query(sql, [values], (err, result) => { 
        if (err) {
            console.error("❌ Database insert error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("✅ Order placed successfully!");
        res.status(201).json({ message: `Order placed successfully! Your lucky token is ${luckyToken}` });
    });
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
