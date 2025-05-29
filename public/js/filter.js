function toggleDateSelectors(prefix) {
  const range = document.getElementById(`range-${prefix}`).value; 
  const dateSelectors = document.getElementById(`date-selectors-${prefix}`);
  const monthGroup = document.getElementById(`month-group-${prefix}`);
  const quarterGroup = document.getElementById(`quarter-group-${prefix}`);
  const halfGroup = document.getElementById(`half-group-${prefix}`);  
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

function toggleScopeSelectors() {
  const scope = document.getElementById('scope').value;
  document.getElementById('department-group').classList.toggle('d-none', scope !== 'department');
  document.getElementById('faculty-group').classList.toggle('d-none', scope !== 'faculty');
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize for all prefixes
  toggleDateSelectors('personal');

  if (document.getElementById('range-school')) {
    toggleDateSelectors('school');
  }


  toggleScopeSelectors();

  // Attach onchange handlers
  document.getElementById('range-personal').addEventListener('change', () => toggleDateSelectors('personal'));
  if(document.getElementById('range-school')){
    document.getElementById('range-school').addEventListener('change', () => toggleDateSelectors('school'));
  }
  if(document.getElementById('scope')){
    document.getElementById('scope').addEventListener('change', toggleScopeSelectors);
  }
});