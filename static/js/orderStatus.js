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
            request = `Your order has already been shipped and is on its way to you. Canceling now is not possible. Contact on &nbsp <a href="https://wa.me/917387227775" target="blank"> <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg> Whatsapp</a> &nbsp for further assessment.`;
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
        <svg xmlns="http://www.w3.org/2000/svg" onclick="document.querySelector('.content').click()" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>`
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