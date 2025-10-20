document.getElementById("invoice-date").textContent = new Date().toISOString().split("T")[0];

// Add new item row
document.getElementById("add-item").addEventListener("click", () => {
  const tbody = document.getElementById("invoice-items");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td contenteditable="true">New Item</td>
    <td contenteditable="true" class="qty">1</td>
    <td contenteditable="true" class="price">0.00</td>
    <td class="amount">$0.00</td>
  `;
  tbody.appendChild(row);
  attachListeners();
  calculateTotals();
});

// Attach listeners to recalculate when values change
function attachListeners() {
  document.querySelectorAll(".qty, .price").forEach(cell => {
    cell.addEventListener("input", calculateTotals);
  });
}

function calculateTotals() {
  let subtotal = 0;
  document.querySelectorAll("#invoice-items tr").forEach(row => {
    const qty = parseFloat(row.querySelector(".qty").textContent) || 0;
    const price = parseFloat(row.querySelector(".price").textContent) || 0;
    const amount = qty * price;
    row.querySelector(".amount").textContent = `$${amount.toFixed(2)}`;
    subtotal += amount;
  });

  const discounts = 0; // you can add logic for this
  const taxes = subtotal * 0.085; // example 8.5% tax
  const total = subtotal - discounts + taxes;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("discounts").textContent = `$${discounts.toFixed(2)}`;
  document.getElementById("taxes").textContent = `$${taxes.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

attachListeners();
calculateTotals();
