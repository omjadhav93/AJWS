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