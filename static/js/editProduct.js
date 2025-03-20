const sameHeight = document.querySelectorAll('.same-height')

let maxHeight = 0;
sameHeight.forEach(element => {
    const height = element.offsetHeight;
    if (height > maxHeight) {
        maxHeight = height;
    }
});

sameHeight.forEach((element, i) => {
    element.style.height = maxHeight + 'px';
});

/* i button text */
const iButton = (e, text) => {
    if (e.parentElement.querySelector('.iBox')) {
        e.parentElement.querySelector('.iBox').remove();
        return;
    }
    const iBoxDiv = document.createElement('div');
    iBoxDiv.classList.add('iBox')
    iBoxDiv.textContent = text;
    e.parentElement.appendChild(iBoxDiv);
}

/* Select Design Setup */
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

    const iBoxes = document.querySelectorAll('.iBox');
    iBoxes.forEach(box => {
        if (!box.contains(e.target) && !box.previousElementSibling.contains(e.target)) {
            iButton(box.previousElementSibling, '');
        }
    })
});

// Discount calculator
const discountChange = () => {
    let currDiscount = document.querySelector('input[name="discount"]').value;
    if (currDiscount < 0 || currDiscount > 100) {
        alert("Please add a valid discount value.");
        document.querySelector('input[name="discount"]').value = null;
        priceDisplay.parentElement.classList.add('final-price');
        return;
    }

    if (currDiscount) {
        document.getElementById('price-value').setAttribute('onkeyup', 'discountChange()')
    } else {
        document.getElementById('price-value').removeAttribute('onkeyup')
        priceDisplay.parentElement.classList.add('final-price');
        return;
    }

    const priceDisplay = document.getElementById('final-price-count')

    let marketPrice = document.getElementById('price-value').value;
    let ans = marketPrice - (marketPrice * currDiscount / 100);

    priceDisplay.innerText = ans + ' Rs';
    priceDisplay.parentElement.classList.remove('final-price');
}

// Initialize discount calculation on page load
window.addEventListener('DOMContentLoaded', () => {
    discountChange();
    /* Loading Animation Ends */
    document.getElementById('loading').style.display = 'none';
    document.body.style.overflowY = 'auto';
}); 