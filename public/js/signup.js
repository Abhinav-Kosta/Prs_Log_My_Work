function handleRoleChange(role) {
    const schoolField = document.getElementById('schoolField');
    const deptField = document.getElementById('departmentField');

    if (role === "faculty") {
      schoolField.style.display = "block";
      deptField.style.display = "block";
    } else if (role === "hoi") {
      schoolField.style.display = "block";
      deptField.style.display = "none";
    } else {
      schoolField.style.display = "none";
      deptField.style.display = "none";
    }
  }

  // Call it once on load to apply correct state
  document.addEventListener("DOMContentLoaded", function () {
    const selectedRole = document.getElementById("role").value;
    handleRoleChange(selectedRole);
});

const departmentOptions = {
    ASET: ["Computer Science", "Information Technology", "Mechanical", "Electronics and Communication", "Civil", "Physics", "Chemistry", "Mathematics"],
    ALS: ["Civil Law", "Criminal Law"],
  };

  function updateDepartments() {
    const schoolSelect = document.getElementById("school");
    const departmentSelect = document.getElementById("department");

    const selectedSchool = schoolSelect.value;
    const departments = departmentOptions[selectedSchool] || [];

    departmentSelect.innerHTML = `<option value="">-- Select Department --</option>`;
    departments.forEach(dept => {
      const option = document.createElement("option");
      option.value = dept;
      option.textContent = dept;
      departmentSelect.appendChild(option);
    });
}