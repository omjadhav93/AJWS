// Get all input elements
const inputs = document.querySelectorAll('.input-element');

// Add event listener to each input
inputs.forEach(input => {
  input.addEventListener('input', function() {
    // Check if input has value
    if (this.value) {
      this.classList.add('has-content');
    } else {
      this.classList.remove('has-content');
    }
  });
});