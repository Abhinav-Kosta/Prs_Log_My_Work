// function toggleDateSelectors(prefix) {
//   const range = document.getElementById(`range-${prefix}`).value; 
//   const dateSelectors = document.getElementById(`date-selectors-${prefix}`);
//   const monthGroup = document.getElementById(`month-group-${prefix}`);
//   const quarterGroup = document.getElementById(`quarter-group-${prefix}`);
//   const halfGroup = document.getElementById(`half-group-${prefix}`);
//   const yearGroup = document.getElementById(`year-${prefix}`)?.closest('.col-md-4');
//   const applyButton = document.querySelector(`#date-selectors-${prefix} .col-md-4.d-flex.align-items-end`);
  
//   // Show/hide date selectors but keep year filter and apply button visible
//   dateSelectors.style.display = 'flex';
  
//   // Hide other filters when 'all' is selected
//   if (range === 'all') {
//     monthGroup.classList.add('d-none');
//     quarterGroup.classList.add('d-none');
//     halfGroup.classList.add('d-none');
//     yearGroup.classList.add('d-none');
//   } 
  
//   // Toggle individual selectors
//   monthGroup.classList.toggle('d-none', range !== 'monthly');
//   quarterGroup.classList.toggle('d-none', range !== 'quarterly');
//   halfGroup.classList.toggle('d-none', range !== 'half');
//   yearGroup.classList.toggle('d-none', range !== 'yearly');
  
//   // Adjust column widths for yearly filter to match half-yearly width
//   if (range === 'yearly' && yearGroup && applyButton) {
//     yearGroup.classList.remove('col-md-4');
//     yearGroup.classList.add('col-md-6');
//     applyButton.classList.remove('col-md-4');
//     applyButton.classList.add('col-md-6');
//   } else if (yearGroup && applyButton) {
//     yearGroup.classList.remove('col-md-6');
//     yearGroup.classList.add('col-md-4');
//     applyButton.classList.remove('col-md-6');
//     applyButton.classList.add('col-md-4');
//   }
// }

function toggleDateSelectors(prefix) {
  const range = document.getElementById(`range-${prefix}`).value; 
  const dateSelectors = document.getElementById(`date-selectors-${prefix}`);
  const monthGroup = document.getElementById(`month-group-${prefix}`);
  const quarterGroup = document.getElementById(`quarter-group-${prefix}`);
  const halfGroup = document.getElementById(`half-group-${prefix}`);
  const yearGroup = document.getElementById(`year-group-${prefix}`);
  const applyButton = document.querySelector(`#date-selectors-${prefix} .d-flex.align-items-end`);

  // Always show container
  dateSelectors.style.display = 'flex';

  // Hide all range-specific filters
  if (monthGroup) monthGroup.classList.add('d-none');
  if (quarterGroup) quarterGroup.classList.add('d-none');
  if (halfGroup) halfGroup.classList.add('d-none');
  if (yearGroup) yearGroup.classList.add('d-none');

  // Reset column classes
  if (yearGroup) yearGroup.classList.remove('col-md-6', 'col-md-4');
  if (applyButton) applyButton.classList.remove('col-md-6', 'col-md-4', 'col-md-12');

  // Handle 'all' (Only Apply button, full width)
  if (range === 'all') {
    if (applyButton) applyButton.classList.add('col-md-12');
    return;
  }

  // For all other ranges: show year
  if (yearGroup) {
    yearGroup.classList.remove('d-none');
    yearGroup.classList.add('col-md-4');
  }
  if (applyButton) applyButton.classList.add('col-md-4');

  // Show specific filters
  if (range === 'monthly') {
    monthGroup.classList.remove('d-none');
  } else if (range === 'quarterly') {
    quarterGroup.classList.remove('d-none');
  } else if (range === 'half') {
    halfGroup.classList.remove('d-none');
  } else if (range === 'yearly') {
    if (yearGroup) {
      yearGroup.classList.remove('col-md-4');
      yearGroup.classList.add('col-md-6');
    }
    if (applyButton) {
      applyButton.classList.remove('col-md-4');
      applyButton.classList.add('col-md-6');
    }
  }
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