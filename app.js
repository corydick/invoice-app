const { jsPDF } = window.jspdf;

// --- Load / Initialize Invoice Number ---
let invoiceNumber = localStorage.getItem('invoiceNumber')
  ? parseInt(localStorage.getItem('invoiceNumber'))
  : 1;
document.getElementById('invoiceNumber').textContent = invoiceNumber
  .toString()
  .padStart(3, '0');

// Default Data
const defaultCompanies = [
  { name: 'My Company A', address: '123 Main St', contact: 'a@example.com' }
];
const defaultBillTo = [
  { name: 'Client 1', address: '789 Client Road', email: 'client1@example.com' }
];

let companies = JSON.parse(localStorage.getItem('companies')) || defaultCompanies;
let billTos = JSON.parse(localStorage.getItem('billTos')) || defaultBillTo;

// DOM Elements
const companySelect = document.getElementById('companySelect');
const companyAddress = document.getElementById('companyAddress');
const companyContact = document.getElementById('companyContact');
const addCompanyBtn = document.getElementById('addCompanyBtn');
const editCompanyBtn = document.getElementById('editCompanyBtn');

const billToSelect = document.getElementById('billToSelect');
const billToAddress = document.getElementById('billToAddress');
const billToEmail = document.getElementById('billToEmail');
const addBillToBtn = document.getElementById('addBillToBtn');
const editBillToBtn = document.getElementById('editBillToBtn');

const taxRateInput = document.getElementById('taxRate');
const discountInput = document.getElementById('discount');

// Initialize date
document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();

// --- Companies ---
function populateCompanies() {
  companySelect.innerHTML = '';
  companies.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.name;
    companySelect.appendChild(opt);
  });
  setCompany(0);
}
function setCompany(i) {
  const c = companies[i];
  companyAddress.textContent = c.address;
  companyContact.textContent = c.contact;
}
companySelect.addEventListener('change', () => setCompany(companySelect.value));
populateCompanies();

addCompanyBtn.addEventListener('click', () => {
  const name = prompt('Company Name:');
  const address = prompt('Address:');
  const contact = prompt('Email or Phone:');
  if (name && address) {
    companies.push({ name, address, contact });
    localStorage.setItem('companies', JSON.stringify(companies));
    populateCompanies();
    companySelect.value = companies.length - 1;
    setCompany(companies.length - 1);
  }
});

editCompanyBtn.addEventListener('click', () => {
  const idx = companySelect.value;
  const action = confirm('Press OK to edit, Cancel to delete this company.');
  if (action) {
    const name = prompt('Company Name:', companies[idx].name);
    const address = prompt('Address:', companies[idx].address);
    const contact = prompt('Contact:', companies[idx].contact);
    companies[idx] = { name, address, contact };
  } else {
    companies.splice(idx, 1);
  }
  localStorage.setItem('companies', JSON.stringify(companies));
  populateCompanies();
});

// --- Bill To ---
function populateBillTos() {
  billToSelect.innerHTML = '';
  billTos.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = b.name;
    billToSelect.appendChild(opt);
  });
  setBillTo(0);
}
function setBillTo(i) {
  const b = billTos[i];
  billToAddress.textContent = b.address;
  billToEmail.textContent = b.email;
}
billToSelect.addEventListener('change', () => setBillTo(billToSelect.value));
populateBillTos();

addBillToBtn.addEventListener('click', () => {
  const name = prompt('Client Name:');
  const address = prompt('Address:');
  const email = prompt('Email:');
  if (name && address) {
    billTos.push({ name, address, email });
    localStorage.setItem('billTos', JSON.stringify(billTos));
    populateBillTos();
    billToSelect.value = billTos.length - 1;
    setBillTo(billTos.length - 1);
  }
});

editBillToBtn.addEventListener('click', () => {
  const idx = billToSelect.value;
  const action = confirm('Press OK to edit, Cancel to delete this client.');
  if (action) {
    const name = prompt('Client Name:', billTos[idx].name);
    const address = prompt('Address:', billTos[idx].address);
    const email = prompt('Email:', billTos[idx].email);
    billTos[idx] = { name, address, email };
  } else {
    billTos.splice(idx, 1);
  }
  localStorage.setItem('billTos', JSON.stringify(billTos));
  populateBillTos();
});

// --- Line Items ---
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

[taxRateInput, discountInput].forEach(input =>
  input.addEventListener('input', updateTotals)
);

function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll('#invoiceItems tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.qty').textContent) || 0;
    const price = parseFloat(row.querySelector('.price').textContent) || 0;
    const total = qty * price;
    row.querySelector('.item-total').textContent = total.toFixed(2);
    subtotal += total;
  });
  const taxRate = parseFloat(taxRateInput.value) || 0;
  const tax = subtotal * (taxRate / 100);
  const discount = parseFloat(discountInput.value) || 0;
  const balance = subtotal + tax - discount;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('balanceDue').textContent = balance.toFixed(2);
}

// --- PDF Functions ---
async function generatePDFBlob() {
  const invoice = document.getElementById('invoice');
  const invoiceNumberStr = invoiceNumber.toString().padStart(3, '0');
  const date = new Date().toISOString().split('T')[0];

  const canvas = await html2canvas(invoice, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'pt', 'a4');
  const imgWidth = 595.28;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  return { pdf, filename: `Invoice-${invoiceNumberStr}-${date}.pdf` };
}

// --- Download PDF ---
document.getElementById('downloadPDFBtn').addEventListener('click', async () => {
  const { pdf, filename } = await generatePDFBlob();
  pdf.save(filename);

  // Auto-increment invoice number
  invoiceNumber++;
  localStorage.setItem('invoiceNumber', invoiceNumber);
  document.getElementById('invoiceNumber').textContent = invoiceNumber
    .toString()
    .padStart(3, '0');
});

// --- Preview PDF ---
document.getElementById('previewPDFBtn').addEventListener('click', async () => {
  const { pdf } = await generatePDFBlob();
  const blob = pdf.output('blob');
  const blobURL = URL.createObjectURL(blob);
  window.open(blobURL, '_blank');
});

// --- Print PDF ---
document.getElementById('printPDFBtn').addEventListener('click', async () => {
  const { pdf } = await generatePDFBlob();
  const blob = pdf.output('blob');
  const blobURL = URL.createObjectURL(blob);

  const printWindow = window.open(blobURL, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
});
