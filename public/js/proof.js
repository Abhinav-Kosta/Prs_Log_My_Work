document.getElementById('proof').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB = 2 * 1048576 bytes
      alert("File size must be under 1MB.");
      this.value = ""; // Clear the file
    }
  });