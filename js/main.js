// Sample PDF data (URLs to PDF files)
const galleries = [
  [
    'pdfs/vet_antibioticos.pdf',
  ],
  [
    'pdfs/vet_antiparasitarios.pdf',
  ],
  [
    'pdfs/vet_saludanimal.pdf',
  ],
  [
    'pdfs/vet_hosmonas.pdf',
  ],
];

let currentGallery = 0;
let currentPdf = 0;
let pdfDoc = null;
let pageNum = 1;
let pdfScale = 1.5;

// Load the PDF
async function loadPDF(pdfUrl) {
  try {
    console.log('Loading PDF:', pdfUrl);
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    pdfDoc = await loadingTask.promise;
    pageNum = 1;
    await renderPage();
    updatePageCounter();
  } catch (error) {
    console.error('Error loading PDF:', error);
    alert('Error loading PDF. Please check the console for details.');
  }
}

async function renderPage() {
  try {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: pdfScale });
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    updatePageCounter();
  } catch (error) {
    console.error('Error rendering page:', error);
  }
}

function openPdfViewer(galleryIndex) {
  try {
    console.log('Opening gallery:', galleryIndex); // Para debuggear
    currentGallery = galleryIndex;
    currentPdf = 0;
    const pdfUrl = galleries[currentGallery][currentPdf];
    console.log('Loading PDF from URL:', pdfUrl); // Para debuggear
    document.getElementById('pdfModal').style.display = 'block';
    loadPDF(pdfUrl);
  } catch (error) {
    console.error('Error in openPdfViewer:', error);
    alert('Error opening PDF viewer. Please check the console for details.');
  }
}

function updatePageCounter() {
  const counter = document.getElementById('page-counter');
  counter.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
}

// Navigation functions
function prevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  renderPage();
}

function nextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  renderPage();
}

document.querySelector('.background-container').addEventListener('click', () => {
  document.getElementById('mainModal').style.display = 'block';
});

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function openPdfViewer(galleryIndex) {
  currentGallery = galleryIndex;
  currentPdf = 0;
  document.getElementById('pdfModal').style.display = 'block';
  loadPDF(galleries[currentGallery][currentPdf]);
}

function closePdfViewer() {
  document.getElementById('pdfModal').style.display = 'none';
  pdfDoc = null;
}

function navigatePdfs(direction) {
  currentPdf = (currentPdf + direction + galleries[currentGallery].length) % galleries[currentGallery].length;
  loadPDF(galleries[currentGallery][currentPdf]);
}

window.onclick = function(event) {
  const mainModal = document.getElementById('mainModal');
  const pdfModal = document.getElementById('pdfModal');
  if (event.target === mainModal) {
    closeModal('mainModal');
  } else if (event.target === pdfModal) {
    closePdfViewer();
  }
}

document.querySelector('.prev').addEventListener('click', prevPage);
document.querySelector('.next').addEventListener('click', nextPage);