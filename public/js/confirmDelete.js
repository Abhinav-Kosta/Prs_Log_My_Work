function openDeleteModal(button) {
  const id = button.getAttribute('data-id');
  const role = button.getAttribute('data-role');
  const collection = button.getAttribute('data-collection');
  const form = document.getElementById('deleteForm');

  form.action = `/${role}/${collection}/${id}?_method=DELETE`;
}