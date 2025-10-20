const { jsPDF } = window.jspdf;

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let images = [];

// Handle file selection
imageInput.addEventListener("change", (e) => {
  images = Array.from(e.target.files);
  preview.innerHTML = "";
  
  images.forEach(file => {
    const img = document.createElement("img");
    img.classList.add("preview-image");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  });

  convertBtn.disabled = images.length === 0;
});

// Convert images to PDF
convertBtn.addEventListener("click", async () => {
  if (images.length === 0) return;
  
  const pdf = new jsPDF();
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const imgData = await toBase64(file);
    const img = new Image();
    img.src = imgData;
    await new Promise(resolve => img.onload = resolve);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save("converted.pdf");
});

// Helper function to convert file to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
