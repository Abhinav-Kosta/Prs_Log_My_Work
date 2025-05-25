function toggleDateSelectors() {
  const range = document.getElementById('range').value; 
  const dateSelectors = document.getElementById('date-selectors');
  const monthGroup = document.getElementById('month-group');
  const quarterGroup = document.getElementById('quarter-group');
  const halfGroup = document.getElementById('half-group');  
  // Show/hide entire block
  if (range === 'all') {
    dateSelectors.style.display = 'none';
  } else {
    dateSelectors.style.display = 'flex';
  } 
  // Toggle individual selectors
  monthGroup.classList.toggle('d-none', range !== 'monthly');
  quarterGroup.classList.toggle('d-none', range !== 'quarterly');
  halfGroup.classList.toggle('d-none', range !== 'half');
}

document.addEventListener("DOMContentLoaded", toggleDateSelectors);