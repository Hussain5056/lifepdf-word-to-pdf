// Icons
export function initIcons() { if (window.lucide) window.lucide.createIcons(); }

// Notifications
export function showNotification(message, type = 'success') {
  const notification = document.getElementById('successNotification');
  const text = document.getElementById('notificationText');
  if (!notification || !text) return;
  text.textContent = message;
  notification.classList.remove('processing', 'download');
  if (type === 'processing') notification.classList.add('processing');
  else if (type === 'download') notification.classList.add('download');
  notification.classList.add('show');
  const hideDelay = type === 'download' ? 5000 : 3000;
  setTimeout(hideNotification, hideDelay);
}
export function hideNotification() {
  const notification = document.getElementById('successNotification');
  if (!notification) return;
  notification.classList.remove('show');
  setTimeout(() => notification.classList.remove('processing', 'download'), 400);
}

// Theme
export function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    initIcons();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.innerHTML = '<i data-lucide="sun"></i>';
  } else {
    themeToggle.innerHTML = '<i data-lucide="moon"></i>';
  }
}

// Header scroll
export function setupHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
}

// Mobile menu
export function setupMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!mobileMenu || !menuBtn) return;
  const toggle = () => {
    const isOpen = mobileMenu.classList.contains('show');
    if (isOpen) {
      mobileMenu.classList.remove('show');
      menuBtn.innerHTML = '<i data-lucide="menu"></i>';
    } else {
      mobileMenu.classList.add('show');
      menuBtn.innerHTML = '<i data-lucide="x"></i>';
    }
    initIcons();
  };
  menuBtn.addEventListener('click', toggle);
}

// File helpers
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// PDF processing
export async function processOriginalPDF(file, toolName, toolId) {
  try {
    const { PDFDocument, rgb } = window.PDFLib;
    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer);
    let processedPdf;
    switch (toolId) {
      case 'merge-pdf': {
        processedPdf = await PDFDocument.create();
        const pages = await processedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        pages.forEach((p) => processedPdf.addPage(p));
        break;
      }
      case 'split-pdf': {
        processedPdf = await PDFDocument.create();
        if (originalPdf.getPageCount() > 0) {
          const [firstPage] = await processedPdf.copyPages(originalPdf, [0]);
          processedPdf.addPage(firstPage);
        }
        break;
      }
      case 'compress-pdf': {
        processedPdf = await PDFDocument.create();
        const cps = await processedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        cps.forEach((p) => processedPdf.addPage(p));
        break;
      }
      case 'rotate-pdf': {
        processedPdf = await PDFDocument.create();
        const rps = await processedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        rps.forEach((page) => { page.setRotation({ angle: 90 }); processedPdf.addPage(page); });
        break;
      }
      case 'watermark-pdf': {
        processedPdf = await PDFDocument.create();
        const wps = await processedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        wps.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText('VAST PDF WATERMARK', { x: width / 2 - 100, y: height / 2, size: 20, color: rgb(0.8, 0.8, 0.8), opacity: 0.5 });
          processedPdf.addPage(page);
        });
        break;
      }
      default: {
        processedPdf = await PDFDocument.create();
        const dps = await processedPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        dps.forEach((p) => processedPdf.addPage(p));
        if (dps.length > 0) {
          const firstPage = processedPdf.getPages()[0];
          firstPage.drawText(`Processed with ${toolName}`, { x: 50, y: 50, size: 12, color: rgb(0, 0.6, 0) });
        }
      }
    }
    const pdfBytes = await processedPdf.save();
    return pdfBytes;
  } catch (e) {
    console.error('Error processing PDF:', e);
    return await file.arrayBuffer();
  }
}

export function initCommonUI() {
  setupThemeToggle();
  setupHeaderScroll();
  setupMobileMenu();
  initIcons();
}