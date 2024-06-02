// Get all input elements
const inputs = document.querySelectorAll('.input-element');

// Add event listener to each input
inputs.forEach(input => {
    if (input.value) {
        input.classList.add('has-content');
    }
    input.addEventListener('input', function () {
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
    elements.forEach((element, i) => {
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
    if (newValue < 1) {
        document.getElementById('quantity').value = 1;
    } else if (newValue > 10) {
        document.getElementById('quantity').value = 10;
    } else {
        document.getElementById('quantity').value = newValue;
    }
}

window.onload = () => {
    const selectOps = document.querySelectorAll('.selectOptBtn');
    selectOps.forEach(select => {
        const selected = select.querySelector('#selected');
        const opts = select.querySelectorAll('.opt');
        let check = true;
        opts.forEach(opt => {
            if (opt.getAttribute('value') == selected.textContent.trim()) {
                check = false;
            }
        })
        if (check) {
            select.querySelector('.opt').click();
            select.querySelector('.opt').click();
        }
    })
}

// Submit Form
const submitDone = () => {
    /* Submitting Form */
    const form = document.getElementById('orderForm');

    form.addEventListener(
        "submit",
        () => {
            form.reportValidity();
        },
        false,
    );

    const selects = document.querySelectorAll('input[type="hidden"]');
    let selectCheck = false;
    selects.forEach(select => {
        if (!select.value && select.value.length == 0) {
            alert(`Please select your ${select.getAttribute('name').toUpperCase()} .`);
            selectCheck = true;
            return;
        }
    })

    if (selectCheck) return;

    confirmPage()
}

const confirmPage = () => {
    const confBkg = document.createElement('div')
    confBkg.classList.add('confirm-background');
    const nav1 = document.querySelector('nav').offsetHeight;
    const nav2 = document.querySelector('navbar').offsetHeight;
    const screen = window.innerHeight;
    confBkg.style.height = `${screen - nav1 - nav2}px`

    const confDiv = document.createElement('div');
    confDiv.classList.add('confirm-container');
    confBkg.appendChild(confDiv);

    const confHeadDiv = document.createElement('div');
    confHeadDiv.classList.add('confirm-head-box');
    confHeadDiv.innerHTML = `
        <p class="confirm-heading">Confirm</p>
        <ion-icon name="close" onclick="document.getElementById('content').click()"></ion-icon>`
    confDiv.appendChild(confHeadDiv);

    const confBtmDiv = document.createElement('div');
    confBtmDiv.classList.add('confirm-bottom-box');
    confDiv.appendChild(confBtmDiv);

    const confPTag = document.createElement('p');
    confPTag.classList.add('confirm-statement');
    confPTag.textContent = 'Are you sure you want to continue?';
    confBtmDiv.appendChild(confPTag);

    const yesNoBtns = document.createElement('div');
    yesNoBtns.classList.add('yes-no-btn');
    yesNoBtns.innerHTML = `
    <button type="button" class="yes-btn" onclick="document.getElementById('orderForm').requestSubmit()">Yes</button>
    <button type="button" class="no-btn" onclick="document.getElementById('content').click()">No</button>`
    confBtmDiv.appendChild(yesNoBtns);

    window.addEventListener('click', closeConfirm, true);

    document.body.classList.add('no-scroll');
    document.getElementById('content').appendChild(confBkg);
}

const closeConfirm = (e) => {
    const clickArea = document.querySelector('#content');
    const nonClickArea = document.querySelector('.confirm-container');
    if (clickArea.contains(e.target) && !nonClickArea.contains(e.target)) {
        window.removeEventListener('click', closeConfirm, true);
        document.querySelector('.confirm-background').remove();
        document.body.classList.remove('no-scroll');
    }
}

