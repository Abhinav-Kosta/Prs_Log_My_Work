function openDeleteModal(button) {
  const id = button.getAttribute('data-id');
  const role = button.getAttribute('data-role');
  const collection = button.getAttribute('data-collection');
  const form = document.getElementById('deleteForm');

  form.action = `/${role}/${collection}/${id}?_method=DELETE`;
}

// Add event listeners for modal events to handle body class
document.addEventListener('DOMContentLoaded', function() {
  const deleteModal = document.getElementById('deleteModal');
  
  if (deleteModal) {
    deleteModal.addEventListener('show.bs.modal', function () {
      document.body.classList.add('modal-open');
    });
    
    deleteModal.addEventListener('hidden.bs.modal', function () {
      document.body.classList.remove('modal-open');
    });
  }
});