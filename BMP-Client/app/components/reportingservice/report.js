document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportFilterForm');
  const searchInput = document.getElementById('searchInput');
  const resetBtn = document.getElementById('resetFilters');
  const exportCSV = document.getElementById('exportCSV');
  const exportPDF = document.getElementById('exportPDF');

  // 🔍 Filter form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(form)).toString();
    window.location = `/reports?${params}`;
  });

  // 🔄 Reset filters
  resetBtn.addEventListener('click', () => {
    window.location = '/reports';
  });

  // 🔎 Client-side search filter
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('#reportTableBody tr').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // 📥 Export buttons
  exportCSV.addEventListener('click', () => {
    window.location = '/reports/export/csv';
  });
  exportPDF.addEventListener('click', () => {
    window.location = '/reports/export/pdf';
  });
});
