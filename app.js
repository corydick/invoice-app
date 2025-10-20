const { jsPDF } = window.jspdf;

// Set invoice date to today
document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString();

// Add line items dynamically
const addItemBtn = document.getElementById('addItemBtn');
const invoiceItems = document.getElementById('invoiceItems');

addItemBtn.addEventListener('click', () => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td contenteditable="true" placeholder="Description"></td>
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
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);

  const tax = 0; // Adjust tax if needed
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('balanceDue').textContent = (subtotal + tax).toFixed(2);
}

// PDF Download
document.getElementById('downloadPDFBtn').addEventListener('click', () => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const invoiceElement = document.querySelector('.invoice-container');

  // Build filename
  const invoiceNumber = document.getElementById('invoiceNumber').textContent.trim();
  const date = new Date().toISOString().split('T')[0];
  const filename = `Invoice-${invoiceNumber}-${date}.pdf`;

  pdf.html(invoiceElement, {
    callback: function (doc) {
      doc.save(filename);
    },
    x: 20,
    y: 20,
    html2canvas: {
      scale: 0.8
    }
  });
});
