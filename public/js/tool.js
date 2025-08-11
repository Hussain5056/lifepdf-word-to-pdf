import { initCommonUI, initIcons, formatFileSize, downloadFile, showNotification, processOriginalPDF } from './shared.js';

let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  initIcons();
  setupUpload();
});

function setupUpload() {
  const uploadArea = document.querySelector('.upload-area');
  if (!uploadArea) return;
  uploadArea.addEventListener('click', handleFileUpload);
}

function ensureContainers() {
  let fileListContainer = document.querySelector('.file-list');
  let progressContainer = document.querySelector('.progress-container');
  let processBtn = document.querySelector('.process-btn');
  const uploadArea = document.querySelector('.upload-area');
  if (!fileListContainer) {
    fileListContainer = document.createElement('div');
    fileListContainer.className = 'file-list';
    uploadArea.parentNode.insertBefore(fileListContainer, uploadArea.nextSibling);
  }
  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
      <div class="progress-bar"><div class="progress-fill"></div></div>
      <div class="progress-text">Processing files...</div>
    `;
    fileListContainer.parentNode.insertBefore(progressContainer, fileListContainer.nextSibling);
  }
  if (!processBtn) {
    processBtn = document.createElement('button');
    processBtn.className = 'process-btn';
    processBtn.innerHTML = '<i data-lucide="play"></i> Process Files';
    processBtn.addEventListener('click', processFiles);
    progressContainer.parentNode.insertBefore(processBtn, progressContainer.nextSibling);
  }
  initIcons();
}

function handleFileUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.multiple = true;
  input.onchange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      selectedFiles = files;
      displaySelectedFiles();
      showNotification(`${files.length} file(s) selected successfully!`);
    }
  };
  input.click();
}

function displaySelectedFiles() {
  ensureContainers();
  const fileListContainer = document.querySelector('.file-list');
  const processBtn = document.querySelector('.process-btn');
  fileListContainer.innerHTML = '';
  selectedFiles.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-info">
        <i data-lucide="file-text"></i>
        <div>
          <div class="file-name">${file.name}</div>
          <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
      </div>
      <button class="remove-file" data-index="${index}"><i data-lucide="x"></i></button>
    `;
    fileListContainer.appendChild(fileItem);
  });
  fileListContainer.classList.add('show');
  processBtn.classList.add('show');
  fileListContainer.querySelectorAll('.remove-file').forEach(btn => btn.addEventListener('click', (e) => {
    const idx = Number(e.currentTarget.getAttribute('data-index'));
    removeFile(idx);
  }));
  initIcons();
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  if (selectedFiles.length > 0) displaySelectedFiles();
  else {
    document.querySelector('.file-list')?.classList.remove('show');
    document.querySelector('.process-btn')?.classList.remove('show');
    document.querySelector('.progress-container')?.classList.remove('show');
  }
}

async function processFiles() {
  if (!window.tool || selectedFiles.length === 0) return;
  const processBtn = document.querySelector('.process-btn');
  const progressContainer = document.querySelector('.progress-container');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  processBtn.disabled = true;
  processBtn.innerHTML = '<i data-lucide="loader"></i> Processing...';
  progressContainer.classList.add('show');
  showNotification(`Processing ${selectedFiles.length} file(s) with ${window.tool.title}...`, 'processing');
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const progress = ((i + 1) / selectedFiles.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Processing ${file.name}... ${Math.round(progress)}%`;
    try {
      const processedBytes = await processOriginalPDF(file, window.tool.title, window.tool.id);
      const base = file.name.replace(/\.pdf$/i, '');
      const processedName = `${base}_${window.tool.id.replace('-', '_')}.pdf`;
      const blob = new Blob([processedBytes], { type: 'application/pdf' });
      setTimeout(() => downloadFile(blob, processedName), i * 300);
    } catch (err) { console.error('Error processing file:', file.name, err); }
    await new Promise(r => setTimeout(r, 300));
  }
  progressFill.style.width = '100%';
  progressText.textContent = 'All files processed successfully!';
  setTimeout(() => showNotification(`✅ ${selectedFiles.length} file(s) processed and downloaded!`, 'download'), 800);
  setTimeout(() => {
    selectedFiles = [];
    document.querySelector('.file-list')?.classList.remove('show');
    progressContainer.classList.remove('show');
    processBtn.classList.remove('show');
    processBtn.disabled = false;
    processBtn.innerHTML = '<i data-lucide="play"></i> Process Files';
    initIcons();
  }, 2500);
}