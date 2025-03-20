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

    if (target.getAttribute('id') == 'state') {
        stateSelected(value, true);
    }
}

window.addEventListener('click', function (e) {
    const selectBtns = document.querySelectorAll('.selectOptBtn');
    selectBtns.forEach(btn => {
        if (!btn.contains(e.target) && !btn.querySelector("#selectOptContainer").classList.contains("addOption")) {
            openOption(btn);
        }
    })
});

/* Setting options for district as per state. */

const statesAndDist = {
    'Maharashtra': ['Ahmednagar', 'Sambhajinagar', 'Mumbai', 'Pune', 'Thane']
}

const stateSelected = async (value, declick) => {
    const district = document.getElementById('district');
    const oldOptions = district.querySelectorAll('.opt:not(#default)');

    oldOptions.forEach(opt => {
        opt.remove();
    })

    if (value) {
        const districts = statesAndDist[value];
        if (districts) {
            districts.forEach(dist => {
                let newOption = document.createElement('span');
                newOption.setAttribute('value', dist);
                newOption.setAttribute('onclick', 'select(this)');
                newOption.textContent = dist;
                newOption.className = 'opt';
                district.querySelector('#selectOptContainer').appendChild(newOption);
            });
        }
    }

    if (declick) {
        district.querySelector('#default').dispatchEvent(new Event('click'));
    }
}

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

window.onload = async () => {
    // Fix for address fields
    const addressFields = document.querySelectorAll('input[type="text"], input[type="number"]');
    addressFields.forEach(field => {
        if (field.value) {
            field.classList.add('has-value');
        }
    });

    const selectOps = document.querySelectorAll('.selectOptBtn');
    for (const select of selectOps) {
        const selected = select.querySelector('#selected');
        const opts = select.querySelectorAll('.opt');
        let check = true;
        opts.forEach(opt => {
            if (opt.getAttribute('value') == selected.textContent.trim()) {
                check = false;
            }
        })
        if (check) {
            select.querySelector('#default').click();
            select.querySelector('#default').click();
        } else if (select.getAttribute('id') == 'state') {
            await stateSelected(selected.textContent.trim(), false);
        }
    }
}

// Submit Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');

    if (form) {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                document.querySelector('#content').click()
                event.preventDefault(); // Prevent the form from submitting
                form.reportValidity(); // Show the validity error messages
            }
        }, false);
    }
    /* Loading Animation Ends */
    document.getElementById('loading').style.display = 'none';
    document.body.style.overflowY = 'auto';
});

const submitDone = () => {
    /* Submitting Form */
    const form = document.getElementById('orderForm');

    const selects = document.querySelectorAll('input[type="hidden"]');
    let selectCheck = false;
    for (const select of selects) {
        if (!select.value && select.value.length == 0) {
            alert(`Please select your ${select.getAttribute('name').toUpperCase()} .`);
            selectCheck = true;
            return;
        }
    }

    if (selectCheck) return;

    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            return;
        }
    }

    confirmPage();
}

const confirmPage = () => {
    const confBkg = document.createElement('div')
    confBkg.classList.add('confirm-background');
    const nav2 = document.querySelector('navbar').offsetHeight;
    const screen = window.innerHeight;
    confBkg.style.height = `${screen - nav2}px`;
    confBkg.style.top = `${nav2}px`;

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
    <button type="button" class="yes-btn" onclick="submitForm()">Yes</button>
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

function submitForm() {
    const form = document.getElementById('orderForm');
    form.requestSubmit();
    form.dispatchEvent(new Event('submit')); // Manually trigger the submit event
}