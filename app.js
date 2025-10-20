const form = document.getElementById('invoiceForm');
const invoicesDiv = document.getElementById('invoices');

// Load saved invoices
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
renderInvoices();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('customerName').value;
  const description = document.getElementById('itemDescription').value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('price').value);
  const total = quantity * price;

  const newInvoice = {
    id: Date.now(),
    customer: name,
    description,
    quantity,
    price,
    total
  };

  invoices.push(newInvoice);
  localStorage.setItem('invoices', JSON.stringify(invoices));

  renderInvoices();
  form.reset();
});

function renderInvoices() {
  invoicesDiv.innerHTML = '';
  invoices.forEach(inv => {
    const el = document.createElement('div');
    el.className = 'invoice';
    el.innerHTML = `
      <h3>${inv.customer}</h3>
      <p>${inv.description} × ${inv.quantity} @ $${inv.price.toFixed(2)}</p>
      <p><strong>Total:</strong> $${inv.total.toFixed(2)}</p>
    `;
    invoicesDiv.appendChild(el);
  });
}
