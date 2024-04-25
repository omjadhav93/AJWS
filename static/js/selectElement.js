// Get all elements with the same class
const elements = document.querySelectorAll('.opt');

// Get the maximum width among all elements
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
    if (i == elements.length - 1) {
        element.style.border = 'none';
    }
});

const options = document.getElementById("selectOptContainer");
const openOption = () => {
    options.classList.toggle("addOption")
}

const select = (e) => {
    let text = e.innerText;
    let value = e.getAttribute('value');
    document.getElementById('selected').innerText = text;
    document.getElementById('selectedOption').value = value;
}

window.addEventListener('click', function (e) {
    if (!document.getElementById('selectOptBtn').contains(e.target) && !options.classList.contains("addOption")) {
        openOption();
    }
});