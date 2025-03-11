const orderList = document.querySelectorAll('.table-container')

orderList.forEach((list, i) => {
    list.style.transform = `translateX(${i * 100}%)`;
})

const changeOrderList = (index) => {
    orderList.forEach((list, i) => {
        list.style.transform = `translateX(${i * 100 - index * 100}%)`;
    })
}

function getOrderStage(stage) {
    const stages = {
        0: 'Cancelled',
        1: 'Placed',
        2: 'Received',
        3: 'In Stock',
        4: 'Shipped',
        5: 'Delivered'
    };
    return stages[stage] || 'Unknown';
}

function getActionBtn(stage, orderId) {
    const btn = {
        0: `<button type="button" class="action-btn stg-0" orderid="${orderId}" stage="0" onclick="getCancleReason(this)">Reason</button>`,
        1: `<button type="button" class="action-btn stg-1" orderid="${orderId}" stage="1" onclick="changeStageSingle(this)">Receive</button>`,
        2: `<button type="button" class="action-btn stg-2" orderid="${orderId}" stage="2" onclick="changeStageSingle(this)">In Stock</button>`,
        3: `<button type="button" class="action-btn stg-3" orderid="${orderId}" stage="3" onclick="changeStageSingle(this)">Delivering</button>`,
        4: `<button type="button" class="action-btn stg-4" orderid="${orderId}" stage="4" onclick="changeStageSingle(this)">Delivered</button>`,
        5: ''
    };
    return btn[stage] || '';
}


function selectAll(cls) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"].${cls}`);
    const checkedBoxes = document.querySelectorAll(`input[type="checkbox"].${cls}:checked`);
    if (checkedBoxes.length < checkboxes.length) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function redirectToGoogleMaps(address) {
    // Encode the origin and destination to make them URL-friendly
    origin = 'Hiware Kumbhar, Shirur, Pune, Maharashtra, 412208'
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(address);
    // Construct the Google Maps directions URL
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}`;
    // Redirect to the Google Maps directions URL
    window.open(googleMapsDirectionsUrl, '_blank');
}

function changeStageSingle(e) {
    const orderId = Number(e.getAttribute('orderid'));
    const changeStage = Number(e.getAttribute('stage')) + 1;

    fetch('/api/order/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds: [orderId], stage: changeStage })
    })
        .then(response => response.json())
        .then(res => {
            alert(res.msg);
            // Reload the page to reflect changes
            window.location.reload();
        })
        .catch(error => {
            console.error('Error :', error);
            alert('An error occurred while updating the order status. Please try again.');
        });
}

function changeStageMultiple(e) {
    let orderIds = [];
    const currStage = Number(e.getAttribute('stage'))
    const selected = document.querySelectorAll(`input[type="checkbox"].stg-${currStage}:checked`);
    const changeStage = currStage + 1;
    
    if (selected.length === 0) {
        alert('Please select at least one order to update.');
        return;
    }
    
    selected.forEach(el => {
        orderIds.push(Number(el.getAttribute('data-order-id')));
    })

    fetch('/api/order/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds: orderIds, stage: changeStage })
    })
        .then(response => response.json())
        .then(res => {
            alert(res.msg);
            // Reload the page to reflect changes
            window.location.reload();
        })
        .catch(error => {
            console.error('Error :', error);
            alert('An error occurred while updating the order status. Please try again.');
        });
}

function getCancleReason(e) {
    const orderId = Number(e.getAttribute('orderid'));

    fetch(`/api/order/cancle/reason?orderId=${orderId}`,)
        .then(response => response.json())
        .then(reason => {
            const confBkg = document.createElement('div')
            confBkg.classList.add('confirm-background');
            const nav1 = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
            const nav2 = document.querySelector('navbar') ? document.querySelector('navbar').offsetHeight : 0;
            const screen = window.innerHeight;
            confBkg.style.height = `${screen - nav1 - nav2}px`

            const confDiv = document.createElement('div');
            confDiv.classList.add('confirm-container');
            confBkg.appendChild(confDiv);

            const confHeadDiv = document.createElement('div');
            confHeadDiv.classList.add('confirm-head-box');
            confHeadDiv.innerHTML = `
                <p class="confirm-heading">Cancellation Reason</p>
                <ion-icon name="close" onclick="document.querySelector('.content').click()"></ion-icon>`
            confDiv.appendChild(confHeadDiv);

            const confBtmDiv = document.createElement('div');
            confBtmDiv.classList.add('confirm-bottom-box');
            confDiv.appendChild(confBtmDiv);

            const reasonText = document.createElement('p');
            reasonText.classList.add('textContent');
            reasonText.innerHTML = `<span>Reason : </span> ${reason.reason || 'No reason provided'}`;
            confBtmDiv.appendChild(reasonText);

            const description = document.createElement('p');
            description.classList.add('textContent');
            description.innerHTML = `<span>Description : </span> ${reason.description || 'No additional details provided'}`;
            confBtmDiv.appendChild(description);

            const okBtn = document.createElement('div');
            okBtn.classList.add('ok-btn-div');
            okBtn.innerHTML = `
                <button type="button" class="ok-btn" onclick="document.querySelector('.content').click()">Ok</button>`
            confBtmDiv.appendChild(okBtn);

            window.addEventListener('click', closeConfirm, true);

            document.body.classList.add('no-scroll');
            document.querySelector('.content').appendChild(confBkg);
        })
        .catch(error => {
            console.error('Error fetching cancellation reason:', error);
            alert('An error occurred while fetching the cancellation reason. Please try again.');
        });
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

// Initialize the observer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const stagesList = document.querySelectorAll(".order-stage")
    stagesList.forEach(item => {
        let orderStage = Number(item.textContent.trim());
        let stage = getOrderStage(orderStage)
        let orderId = Number(item.getAttribute('orderId').trim());
        item.textContent = stage;
        const actionTag = item.nextElementSibling;
        if (actionTag) {
            actionTag.innerHTML = getActionBtn(orderStage, orderId);
        }
    })
});