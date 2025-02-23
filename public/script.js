document.addEventListener("DOMContentLoaded", () => {
    // Reset lucky token only on manual refresh
    if (!sessionStorage.getItem("visited")) {
        localStorage.removeItem("luckyToken");
        sessionStorage.setItem("visited", "true");
    }

    // Generate lucky token if not set
    let tokenNumber = localStorage.getItem("luckyToken");
    if (!tokenNumber) {
        tokenNumber = Math.floor(Math.random() * 1000) + 1;
        localStorage.setItem("luckyToken", tokenNumber);
    }

    // Display lucky token number on homepage
    const randomNumberSpan = document.getElementById("randomNumber");
    if (randomNumberSpan) {
        randomNumberSpan.textContent = tokenNumber;
    }

    // Handle order form submission
    const orderForm = document.getElementById("orderForm");
    // ... existing code ...

if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll("input[type='number']");
        let orderItems = [];

        inputs.forEach(input => {
            if (input.value > 0) {
                orderItems.push({ name: input.name, quantity: parseInt(input.value) });
            }
        });

        if (orderItems.length === 0) {
            alert("Please select at least one item.");
            return;
        }

        // Get pickup time
        const pickupTime = document.getElementById("pickup-time").value;
        if (!pickupTime) {
            alert("Please select a pickup time.");
            return;
        }

        // Send order data to backend
        try {
            const response = await fetch("http://localhost:5000/submit-order", {  
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    order_items: orderItems,
                    pickup_time: pickupTime
                })
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("An error occurred while placing the order.");
        }
    });
}


});
