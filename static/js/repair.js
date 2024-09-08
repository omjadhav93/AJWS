const msgBox = document.querySelector('.msg');

if(msgBox){
    setTimeout(() => {
        msgBox.style.transform = 'translateX(-50%) scale(1)';
        const endMsg = setTimeout(() => {
            msgBox.style.transform = 'translateX(-50%) scale(0)';
        }, 10000)
        window.addEventListener("click", (e) => {
            if(!msgBox.contains(e.target)){
                msgBox.style.transform = 'translateX(-50%) scale(0)';
                clearTimeout(endMsg);
            }
        })
    }, 1000)
}

const viewDetails = (e) => {
    const parent = e.parentElement;
    const hides = parent.querySelectorAll('.extras');

    hides.forEach(item => {
        item.classList.toggle('hidden');
    })
    let state = hides[0].classList.contains('hidden');
    
    if(state){
        e.textContent = 'View Details';
    }else {
        e.textContent = 'View Less';
    }
}

const markReviewed = (id) => {
    if (window.confirm('Are you sure you want to mark this request reviewed.')) {
        const form = document.createElement('form');
        form.action = '/repair/reviewed';
        form.method = 'POST';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.value = id;
        idInput.name = 'Id';

        form.appendChild(idInput);

        document.body.appendChild(form);

        form.submit();
    }
}

window.onload = () => {
    // Clear query parameters from the URL
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
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

    if (target.getAttribute('id') == 'category') {
        categorySelected(value);
    }else if(target.getAttribute('id') == 'state') {
        stateSelected(value);
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

/* Setting options for product type and product */
const category = {
    'Home and Kitchen Appliances': ['Water Filter and Purifiers', 'Water Filter Appliances'],
}

const categorySelected = async (value) => {
    // Remove past options if any. 
    const productType = document.getElementById('product-type')
    const oldOptions = productType.querySelectorAll('.opt:not(#default)')

    oldOptions.forEach(opt => {
        opt.remove();
    })

    // Set new options as per category.
    if (value) {
        const productTypes = category[value];
        productTypes.forEach(pt => {
            let newOption = document.createElement('span');
            newOption.setAttribute('value', pt);
            newOption.setAttribute('onclick', 'select(this)');
            newOption.textContent = pt;
            newOption.className = 'opt';
            productType.querySelector('#selectOptContainer').appendChild(newOption);
        })
    }

    productType.querySelector('#default').dispatchEvent(new Event('click'));
}

/* Setting options for district as per state. */

const statesAndDist = {
    'Maharashtra': ['Ahmednagar','Sambhajinagar','Mumbai','Pune','Thane']
}

const stateSelected = async (value) => {
    const district = document.getElementById('district');
    const oldOptions = district.querySelectorAll('.opt:not(#default)');

    oldOptions.forEach(opt => {
        opt.remove();
    })

    if(value) {
        const districts = statesAndDist[value];
        districts.forEach(dist => {
            let newOption = document.createElement('span');
            newOption.setAttribute('value', dist);
            newOption.setAttribute('onclick', 'select(this)');
            newOption.textContent = dist;
            newOption.className = 'opt';
            district.querySelector('#selectOptContainer').appendChild(newOption);
        })
    }

    district.querySelector('#default').dispatchEvent(new Event('click'));
}

// Submit Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('repairForm');

    if (form) {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                document.querySelector('.content').click()
                event.preventDefault(); // Prevent the form from submitting
                form.reportValidity(); // Show the validity error messages
            }else {
                form.submit();
            }
        }, false);
    }
});

const submitDone = () => {
    /* Submitting Form */

    const selects = document.querySelectorAll('input[type="hidden"]');
    let selectCheck = false;
    for(const select of selects) {
        if (!select.value && select.value.length == 0) {
            alert(`Please select your ${select.getAttribute('name').toUpperCase()} .`);
            selectCheck = true;
            return;
        }
    }

    if (selectCheck) return;

    confirmPage()
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
        <ion-icon name="close" onclick="document.querySelector('.content').click()"></ion-icon>`
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
    <button type="button" class="no-btn" onclick="document.querySelector('.content').click()">No</button>`
    confBtmDiv.appendChild(yesNoBtns);

    window.addEventListener('click', closeConfirm, true);

    document.body.classList.add('no-scroll');
    document.querySelector('.content').appendChild(confBkg);
}

const closeConfirm = (e) => {
    const clickArea = document.querySelector('.content');
    const nonClickArea = document.querySelector('.confirm-container');
    if (clickArea.contains(e.target) && !nonClickArea.contains(e.target)) {
        window.removeEventListener('click', closeConfirm, true);
        document.querySelector('.confirm-background').remove();
        document.body.classList.remove('no-scroll');
    }
}

function submitForm() {
    const form = document.getElementById('repairForm');
    form.dispatchEvent(new Event('submit')); // Manually trigger the submit event
}