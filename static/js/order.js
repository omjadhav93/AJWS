// Get all input elements
const inputs = document.querySelectorAll('.input-element');

// Add event listener to each input
inputs.forEach(input => {
  if(input.value) {
    input.classList.add('has-content');
  }
  input.addEventListener('input', function() {
    // Check if input has value
    if (this.value) {
      this.classList.add('has-content');
    } else {
      this.classList.remove('has-content');
    }
  });
});

// Get all elements with the same class
const selectOptContainer = document.querySelectorAll('.selectOptContainer');

// Get the maximum width among all elements
selectOptContainer.forEach(option => {
    const elements = option.querySelectorAll('.opt')
    
    let maxWidth = 0;
    elements.forEach(element => {
        const width = element.offsetWidth;
        if (width > maxWidth) {
            maxWidth = width;
        }
    });
    // Set the width of all elements to the maximum width
    elements.forEach((element,i) => {
        element.style.width = maxWidth + 'px';
        if (i == 0) {
            element.style.border = 'none';
        }
    });

})

const openOption = (btn) => {
    btn.querySelector("#selectOptContainer").classList.toggle("addOption")
}

const select = (e) => {
    let text = e.innerText;
    let value = e.getAttribute('value');
    let target = e.parentElement.parentElement;
    target.querySelector('#selected').innerText = text;
    target.nextElementSibling.value = value;
}

window.addEventListener('click', function (e) {
    const selectBtns = document.querySelectorAll('.selectOptBtn');
    selectBtns.forEach(btn => {
        if (!btn.contains(e.target) && !btn.querySelector("#selectOptContainer").classList.contains("addOption")) {
            openOption(btn);
        }
    })
});

// Quantity Changer
const quantity = (x) => {
    const currValue = Number(document.getElementById('quantity').value);
    const newValue = currValue + x;
    if(newValue < 1){
        document.getElementById('quantity').value = 1;
    }else if(newValue > 10){
        document.getElementById('quantity').value = 10;
    }else{
        document.getElementById('quantity').value = newValue;
    }
}