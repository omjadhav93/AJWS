const images = document.querySelectorAll('.image-box');
const pointer = document.querySelectorAll('.pointer');
let imgPtr = 0;

images.forEach((img, i) => {
    img.style.transform = `translateX(${i * 100}%)`;
})

const imageChanger = (m) => {
    images.forEach((img, i) => {
        img.style.transform = `translateX(${i * 100 - m * 100}%)`;
    })
    pointer.forEach((ptr, i) => {
        if (i == m) {
            ptr.classList.add('fill');
        } else {
            ptr.classList.remove('fill');
        }
    })
    imgPtr = m;
}

const cancleConfirm = (stage, orderId) => {
    let request = "";

    switch (stage) {
        case 1:
            request = "We kindly request you to reconsider canceling your order at this stage. Your order has just been placed, and we are preparing it for processing.";
            break;
        case 2:
            request = "We have received your order and are processing it. Canceling now may cause inconvenience. We appreciate your understanding.";
            break;
        case 3:
            request = "Your order is now in stock and ready for shipment. Canceling at this stage could lead to potential losses. Please reconsider your decision.";
            break;
        case 4:
            request = `Your order has already been shipped and is on its way to you. Canceling now is not possible. Contact on &nbsp <a href="https://wa.me/917387227775" target="blank"> <ion-icon name="logo-whatsapp" role="img" class="md hydrated"></ion-icon> Whatsapp</a> &nbsp for further assessment.`;
            break;
        case 5:
            request = "Your order has been delivered. Canceling at this stage is not possible as the product has already reached you. Thank you for your understanding.";
            break;
        default:
            request = "Invalid stage. Please provide a valid order stage.";
    }

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
    confPTag.textContent = request;
    confBtmDiv.appendChild(confPTag);

    if (stage == 5) {
        window.addEventListener('click', closeConfirm, true);

        document.body.classList.add('no-scroll');
        document.querySelector('.content').appendChild(confBkg);
        return;
    }

    if(stage == 4){
        confPTag.innerHTML = request;

        window.addEventListener('click', closeConfirm, true);

        document.body.classList.add('no-scroll');
        document.querySelector('.content').appendChild(confBkg);
        return;
    }

    const cancleForm = document.createElement("form");
    cancleForm.method = "POST";
    cancleForm.action = "/order/cancle";
    cancleForm.classList.add('cancle-form');

    const selectReason = document.createElement("div");
    selectReason.classList.add("form-group");
    selectReason.innerHTML = `<label for="cancel-reason">Reason for Cancellation:</label>
    <select id="cancel-reason" name="reason" required>
      <option value=""> Select A Option</option>
      <option value="Found a Better Price Elsewhere">Found a Better Price Elsewhere</option>
      <option value="Changed My Mind">Changed My Mind</option>
      <option value="Order Delayed">Order Delayed</option>
      <option value="Item No Longer Needed">Item No Longer Needed</option>
      <option value="Ordered by Mistake">Ordered by Mistake</option>
      <option value="Poor Customer Reviews">Poor Customer Reviews</option>
      <option value="Found a Better Product">Found a Better Product</option>
      <option value="Technical Issues with the Website">Technical Issues with the Website</option>
      <option value="Payment Issues">Payment Issues</option>
      <option value="Incorrect Item Ordered">Incorrect Item Ordered</option>
      <option value="Other">Other</option>
    </select>`;
    cancleForm.appendChild(selectReason);

    const describeReason = document.createElement("div");
    describeReason.classList.add("form-group");
    describeReason.innerHTML = `<label for="description">Additional Details (Optional):</label>
    <textarea id="description" name="description" placeholder="Please provide any additional details..."></textarea>`;
    cancleForm.appendChild(describeReason);

    const orderIdInput = document.createElement("input");
    orderIdInput.type = "hidden";
    orderIdInput.name = "orderId";
    orderIdInput.value = orderId;
    cancleForm.appendChild(orderIdInput);

    const yesNoBtns = document.createElement('div');
    yesNoBtns.classList.add('yes-no-btn');
    yesNoBtns.innerHTML = `
    <button type="submit" class="cancle-btn btn-submit">Cancle</button>
    <button type="button" class="dont-cancle-btn" onclick="document.querySelector('.content').click()">Don't Cancle</button>`
    cancleForm.appendChild(yesNoBtns);
    confBtmDiv.appendChild(cancleForm);

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

document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        images.forEach((img, i) => {
            img.style.transform = `translateX(${i * 100 - imgPtr * 100}%)`;
        })
        pointer.forEach((ptr, i) => {
            if (i == imgPtr) {
                ptr.classList.add('fill');
            } else {
                ptr.classList.remove('fill');
            }
        })
        imgPtr++;
        if (imgPtr == images.length) {
            imgPtr = 0;
        }
    }, 3000)
    
    /* Loading Animation Ends */
    document.getElementById('loading').style.display = 'none';
    document.body.style.overflowY = 'auto';
})