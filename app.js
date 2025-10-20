const { jsPDF } = window.jspdf;

// --- Default Data ---
const defaultCompanies = [
  { name: 'My Company A', address: '123 Main St', contact: 'a@example.com' },
  { name: 'My Company B', address: '456 Second Ave', contact: 'b@example.com' }
];

const defaultShipTos = [
  { name: 'Client 1', address: '789 Client Road', phone: '555-1111' },
  { name: 'Client 2', address: '101 Market St', phone: '555-2222' }
];

// --- Load saved or defaults ---
let companies = JSON.parse(localStorage.getItem('companies')) || defaultCompanies;
let shipTos = JSON.parse(localStorage.getItem('shipTos')) || defaultShipTos;

// --- DOM elements ---
const companySelect = document.getElementById('companySelect');
const companyAddress = document.getElementById('companyAddress');
const companyContact = document.getElementById('companyContact');

const shipToSelect = document.getElementById('shipToSelect');
const shipToAddress = document.getElementById('shipToAddress');
const shipToPhone = document.getElementById('shipToPhone');
const addShipToBtn = document.getElementById('addShipToBtn');

// --- Initialize date ---
document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();

// --- Populate dropdowns ---
function populateCompanies() {
  companySelect.innerHTML = '';
  companies.forEach((c, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = c.name;
    companySelect.appendChild(opt);
  });
  setCompany(0);
}

function setCompany(index) {
  const c = companies[index];
  companyAddress.textContent = c.address;
  companyContact.textContent = c.contact;
}

function populateShipTos() {
  shipToSelect.innerHTML = '';
  shipTos.forEach((s, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = s.name;
    shipToSelect.appendChild(opt);
  });
  setShipTo(0);
}

function setShipTo(index) {
  const s = shipTos[index];
  shipToAddress.textContent = s.address;
  shipToPhone.textContent = s.phone;
}

companySelect.addEventListener('change', () => setCompany(companySelect.value));
shipToSelect.addEventListener('change', () => setShipTo(shipToSelect.value));

populateCompanies();
populateShipTos();

// --- Add new ship to ---
addShipToBtn.addEventListener('click', () => {
  const name = prompt('Enter Ship To Name:');
  const address = prompt('Enter Address:');
  const phone = prompt('Enter Phone:');
  if (name && address) {
    shipTos.push({ name, address, phone });
    localStorage.setItem('shipTos', JSON.stringify(shipTos));
    populateShipTos();
    shipToSelect.value = shipTos.length - 1;
    setShipTo(shipTos.length - 1);
  }
});

// --- Line items ---
const addItemBtn = document.getElementById('addItemBtn');
const invoiceItems = document.getElementById('invoiceItems');

addItemBtn.addEventListener('click', () => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td contenteditable="true"></td>
    <td contenteditable="true" class="qty">0</td>
    <td contenteditable="true" class="price">0.00</td>
    <td class="item-total">0.00</td>
  `;
  invoiceItems.appendChild(row);
  row.addEventListener('input', updateTotals);
});

function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll('#invoiceItems tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.qty').textContent) || 0;
    const price = parseFloat(row.querySelector('.price').textContent) || 0;
    const total = qty * price;
    row.querySelector('.item-total').textContent = total.toFixed(2);
    subtotal += total;
  });
  document.getElem
