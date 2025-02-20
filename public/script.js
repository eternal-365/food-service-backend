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

    // Initialize an empty order list in localStorage if not present
    if (!localStorage.getItem("selectedOrders")) {
        localStorage.setItem("selectedOrders", JSON.stringify([]));
    }

    // Handle order form submission
    const orderForm = document.getElementById("orderForm");
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

            // Detect category (Tiffins, Lunch, Drinks)
            const category = window.location.pathname.includes("tiffins") ? "Tiffins" :
                            window.location.pathname.includes("lunch_select_section") ? "Lunch" :
                            "Drinks";

            // Send order data to backend
            const response = await fetch("https://food-o-1.onrender.com/submit-order", {  // ✅ Back to local API
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: tokenNumber, category: category, items: orderItems })
            });
            

            const result = await response.json();
            alert(result.message);
        });
    }
});
