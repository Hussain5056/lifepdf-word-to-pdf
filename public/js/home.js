import { initCommonUI, initIcons, showNotification } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  renderTools();
  initIcons();
});

const availableToolIds = new Set(['merge-pdf', 'split-pdf']);

const tools = [
  { id: 'merge-pdf', title: 'Merge PDF', desc: 'Combine multiple PDFs into one document seamlessly', icon: 'merge', color: 'linear-gradient(135deg, #3b82f6, #06b6d4)', badge: 'Popular' },
  { id: 'split-pdf', title: 'Split PDF', desc: 'Separate pages or extract specific sections', icon: 'scissors', color: 'linear-gradient(135deg, #10b981, #059669)', badge: 'Popular' },
  { id: 'compress-pdf', title: 'Compress PDF', desc: 'Reduce file size while maintaining quality', icon: 'download', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', badge: 'Popular' },
  { id: 'pdf-to-word', title: 'PDF to Word', desc: 'Convert PDF to editable DOCX documents', icon: 'file-text', color: 'linear-gradient(135deg, #1e40af, #3b82f6)', badge: 'Popular' },
  { id: 'pdf-to-excel', title: 'PDF to Excel', desc: 'Extract tables and data to Excel spreadsheets', icon: 'table', color: 'linear-gradient(135deg, #059669, #10b981)', badge: null },
  { id: 'pdf-to-powerpoint', title: 'PDF to PowerPoint', desc: 'Convert PDF pages to PowerPoint slides', icon: 'presentation', color: 'linear-gradient(135deg, #dc2626, #f97316)', badge: null },
  { id: 'word-to-pdf', title: 'Word to PDF', desc: 'Convert Word documents to PDF format', icon: 'file-text', color: 'linear-gradient(135deg, #3b82f6, #1e40af)', badge: null },
  { id: 'excel-to-pdf', title: 'Excel to PDF', desc: 'Convert Excel spreadsheets to PDF', icon: 'table', color: 'linear-gradient(135deg, #10b981, #059669)', badge: null },
  { id: 'powerpoint-to-pdf', title: 'PowerPoint to PDF', desc: 'Convert presentations to PDF format', icon: 'presentation', color: 'linear-gradient(135deg, #f97316, #dc2626)', badge: null },
  { id: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert images to PDF documents', icon: 'image', color: 'linear-gradient(135deg, #eab308, #f59e0b)', badge: null },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Convert PDF pages to high-quality images', icon: 'image', color: 'linear-gradient(135deg, #f59e0b, #eab308)', badge: null },
  { id: 'edit-pdf', title: 'Edit PDF', desc: 'Add text, images, and annotations to PDFs', icon: 'edit-3', color: 'linear-gradient(135deg, #ec4899, #be185d)', badge: 'Popular' },
  { id: 'sign-pdf', title: 'Sign PDF', desc: 'Add digital signatures to documents', icon: 'pen-tool', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', badge: null },
  { id: 'protect-pdf', title: 'Protect PDF', desc: 'Add password protection and encryption', icon: 'lock', color: 'linear-gradient(135deg, #dc2626, #b91c1c)', badge: null },
  { id: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove passwords and restrictions from PDFs', icon: 'unlock', color: 'linear-gradient(135deg, #eab308, #d97706)', badge: null },
  { id: 'rotate-pdf', title: 'Rotate PDF', desc: 'Rotate pages to correct orientation', icon: 'rotate-cw', color: 'linear-gradient(135deg, #f97316, #ea580c)', badge: null },
  { id: 'watermark-pdf', title: 'Add Watermark', desc: 'Add text or image watermarks to PDFs', icon: 'type', color: 'linear-gradient(135deg, #7c3aed, #6d28d9)', badge: null },
  { id: 'organize-pdf', title: 'Organize PDF', desc: 'Reorder, add, or delete PDF pages', icon: 'settings', color: 'linear-gradient(135deg, #64748b, #475569)', badge: null },
  { id: 'ocr-pdf', title: 'OCR PDF', desc: 'Make scanned PDFs searchable and editable', icon: 'eye', color: 'linear-gradient(135deg, #059669, #047857)', badge: 'New!' },
  { id: 'pdf-reader', title: 'PDF Reader', desc: 'View and read PDF files online', icon: 'book-open', color: 'linear-gradient(135deg, #0891b2, #0e7490)', badge: null }
];

function renderTools() {
  const toolsGrid = document.getElementById('toolsGrid');
  if (!toolsGrid) return;
  toolsGrid.innerHTML = '';
  tools.forEach((tool, index) => {
    const card = document.createElement(availableToolIds.has(tool.id) ? 'a' : 'div');
    card.className = 'tool-card';
    card.style.animationDelay = `${index * 50}ms`;
    if (availableToolIds.has(tool.id)) {
      card.href = `/tools/${tool.id}.html`;
    } else {
      card.addEventListener('click', () => showNotification('Coming soon as a dedicated page.'));
    }
    card.innerHTML = `
      ${tool.badge ? `<div class="tool-badge">${tool.badge}</div>` : ''}
      <div class="tool-icon" style="background: ${tool.color}">
        <i data-lucide="${tool.icon}"></i>
      </div>
      <h3 class="tool-title">${tool.title}</h3>
      <p class="tool-description">${tool.desc}</p>
    `;
    toolsGrid.appendChild(card);
  });
  initIcons();
}