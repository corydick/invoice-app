// ======================
// Date & Invoice Number
// ======================
document.getElementById("invoice-date").textContent = new Date().toISOString().split("T")[0];

// ======================
// Company & Bill To Storage with Suggestions
// ======================
const companyKey = 'savedCompanies';
const billtoKey = 'savedBillto';

function getSaved(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveEntry(key, entry) {
  const saved = getSaved(key);
  const existing = saved.findIndex(e => e.name === entry.name);
  if (existing !== -1) saved[existing] = entry;
  else saved.push(entry);
  localStorage.setItem(key, JSON.stringify(saved));
  updateSuggestions(key);
}

function updateSuggestions(key) {
  const saved = getSaved(key);
  const datalist = document.getElementById(key === companyKey ? 'company-suggestions' : 'billto-suggestions');
  datalist.innerHTML = '';
  saved.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.name;
    datalist.appendChild(opt);
  });
}

function fillFields(key, name) {
  const entry = getSaved(key).find(e => e.name === name);
  if (entry) {
    if (key === companyKey) {
      document.getElementById('company-name').value = entry.name;
      document.getElementById('company-address').value = entry.address;
      document.getElementById('company-city').value = entry.city;
      document.getElementById('company-phone').value = entry.phone;
      document.getElementById('company-email').value = entry.email;
      document.getElementById('company-website').value = entry.website;
      // also update header
      document.getElementById('header-company-name').textContent = entry.name;
      document.getElementById('header-company-address').textContent = entry.address;
      document.getElementById('header-company-city').textContent = entry.city;
      document.getElementById('header-company-phone').textContent = entry.phone;
      document.getElementById('header-company-email').textContent = entry.email;
      document.getElementById('header-company-website').textContent = entry.website;
    } else {
      document.getElementById('billto-name').value = entry.name;
      document.getElementById('billto-company').value = entry.company;
      document.getElementById('billto-address').value = entry.address;
      document.getElementById('billto-city').value = entry.city;
      document.getElementById('billto-phone').value = entry.phone;
    }
  }
}

// Company save
document.getElementById('save-company').addEventListener('click', () => {
  const entry = {
    name: document.getElementById('company-name').value,
    address: document.getElementById('company-address').value,
    city: document.getElementById('company-city').value,
    phone: document.getElementById('company-phone').value,
    email: document.getElementById('company-email').value,
    website: document.getElementById('company-website').value
  };
  if (entry.name) saveEntry(companyKey, entry);
});

// Bill to save
document.getElementById('save-billto').addEventListener('click', () => {
  const entry = {
    name: document.getElementById('billto-name').value,
    company: document.getElementById('billto-company').value,
    address: document.getElementById('billto-address').value,
    city: document.getElementById('billto-city').value,
    phone: document.getElementById('billto-phone').value
  };
  if (entry.name) saveEntry(billtoKey, entry);
});

// Auto-fill on input
document.getElementById('company-name').addEventListener('change', (e) => fillFields(companyKey, e.target.value));
document.getElementById('billto-name').addEventListener('change', (e) => fillFields(billtoKey, e.target.value));

updateSuggestions(companyKey);
updateSuggestions(billtoKey);

// ======================
// Invoice Items
// ======================
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

function attachListeners() {
  document.querySelectorAll(".qty, .price").forEach(cell => {
    cell.removeEventListener("input", calculateTotals);
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

  const discounts = 0;
  const taxes = subtotal * 0.085; // 8.5%
  const total = subtotal - discounts + taxes;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("discounts").textContent = `$${discounts.toFixed(2)}`;
  document.getElementById("taxes").textContent = `$${taxes.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

attachListeners();
calculateTotals();
