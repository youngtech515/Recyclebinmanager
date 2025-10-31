document.addEventListener('DOMContentLoaded', () => {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.select-item');
  const restoreBtn = document.getElementById('restoreSelected');
  const deleteBtn = document.getElementById('deleteSelected');
  const modal = document.getElementById('confirmModal');
  const modalMsg = document.getElementById('modalMessage');
  const confirmAction = document.getElementById('confirmAction');
  const cancelAction = document.getElementById('cancelAction');
  let currentAction = null;
  let selectedIds = [];

  // Select all items
  selectAll?.addEventListener('change', () => {
    checkboxes.forEach(chk => chk.checked = selectAll.checked);
  });

  // Bulk restore/delete
  restoreBtn.addEventListener('click', () => openModal('restore'));
  deleteBtn.addEventListener('click', () => openModal('delete'));

  function openModal(action) {
    selectedIds = Array.from(checkboxes).filter(chk => chk.checked).map(chk => chk.dataset.id);
    if (!selectedIds.length) {
      alert('Please select at least one item.');
      return;
    }
    currentAction = action;
    modalMsg.textContent = action === 'restore'
      ? `Restore ${selectedIds.length} selected items?`
      : `Permanently delete ${selectedIds.length} selected items?`;
    modal.classList.remove('hidden');
  }

  confirmAction.addEventListener('click', async () => {
    try {
      const res = await fetch(`/recovery/${currentAction}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      alert(data.message);
      location.reload();
    } catch (err) {
      alert('Error performing action.');
    } finally {
      modal.classList.add('hidden');
    }
  });

  cancelAction.addEventListener('click', () => modal.classList.add('hidden'));

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('#recoveryTableBody tr').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Filter form
  const form = document.getElementById('recoveryFilterForm');
  const resetBtn = document.getElementById('resetFilters');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams(new FormData(form)).toString();
    window.location = `/recovery?${params}`;
  });
  resetBtn.addEventListener('click', () => window.location = '/recovery');
});
