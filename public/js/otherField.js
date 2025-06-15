/**
 * Shows or hides a target input field based on whether "Other" is selected in a dropdown.
 *
 * @param {string} selectId - The ID of the dropdown/select element.
 * @param {string} targetId - The ID of the input field to show/hide.
 * @param {string} triggerValue - The value in the dropdown that triggers the field to show (usually "Other").
 */
function setupConditionalField(selectId, targetId, triggerValue = "Other") {
  const selectElement = document.getElementById(selectId);
  const targetElement = document.getElementById(targetId);

  if (!selectElement || !targetElement) return;

  // Initial check on page load
  toggleField(selectElement.value);

  // Add listener
  selectElement.addEventListener("change", function () {
    toggleField(this.value);
  });

  function toggleField(value) {
    if (value === triggerValue) {
      targetElement.parentElement.style.display = "block";
    } else {
      targetElement.parentElement.style.display = "none";
      targetElement.value = ""; // Clear value when hidden
    }
  }
}