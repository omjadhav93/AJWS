const sectionList = document.querySelectorAll('.profile-content > div');
sectionList.forEach((section, i) => {
    section.style.transform = `translateY(${i * 100}%)`;
})

const changeMenu = (e) => {
    const menuOps = document.querySelectorAll('.profile-menu-item');
    let menuIndex = 0;
    menuOps.forEach((menu, i) => {
        if (menu.classList.contains('highlight')) {
            menu.classList.remove('highlight')
        }
        if (menu == e) {
            e.classList.add('highlight')
            menuIndex = i;
        }
    })
    sectionList.forEach((section, i) => {
        section.style.transform = `translateY(${(i - menuIndex) * 100}%)`;
    })
}

// Your Orders Section
const orderList = document.querySelectorAll('.list-item')

orderList.forEach((list, i) => {
    list.style.transform = `translateX(${i * 100}%)`;
})

const changeOrderList = (index) => {
    orderList.forEach((list, i) => {
        list.style.transform = `translateX(${i * 100 - index * 100}%)`;
    })
}

// Setting Section
const edit = cls => {
    const section = document.querySelector(`.${cls}`);
    const setHead = section.querySelector('.setting-head');

    const changeOpt = document.createElement('div');
    changeOpt.classList.add('change-opt');

    if (cls == 'personal-info') {
        changeOpt.innerHTML = `
            <div class="input-split"> 
                <div class="input"> 
                  <input class="input-element" type="text" name="first-name" id="first-name" required="required"/>
                  <label class="input-label" for="first-name">First Name</label>
                </div>
                <div class="input"> 
                  <input class="input-element" type="text" name="last-name" id="last-name" required="required"/>
                  <label class="input-label" for="last-name">Last Name</label>
                </div>
            </div>
            <button type="button" class="save-btn" onclick="saveEdited(this)"> Save </button>`;
    } else if (cls == 'email-info') {
        changeOpt.innerHTML = `
            <div class="input"> 
              <input class="input-element" type="email" name="email" id="email" required="required"/>
              <label class="input-label" for="email">Email Address</label>
            </div>
            <button type="button" class="save-btn" onclick="saveEdited(this)"> Save </button>`;
    } else if (cls == 'phone-number') {
        changeOpt.innerHTML = `
            <div class="input"> 
              <input class="input-element" type="number" name="phone" id="phone" required="required"/>
              <label class="input-label" for="phone">Phone Number</label>
            </div>
            <button type="button" class="save-btn" onclick="saveEdited(this)"> Save </button>`;
    }

    setHead.querySelector('.setting-edit').removeAttribute('onclick')

    section.innerHTML = '';
    section.appendChild(setHead);
    section.appendChild(changeOpt);

    if (cls == 'personal-info') {
        const text = section.innerHTML;
        section.innerHTML = text + `<p class="add-address" onclick="window.location.href = '/user/address'" style="width: 50%;'">Add a Address </p>`;
    }


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

}



// Confirm using password
const saveEdited = (e) => {
    const parent = e.parentElement;
    const inputElements = parent.querySelectorAll('.input-element');
    const formElement = document.createElement('form');
    formElement.action = '/api/auth/update';
    formElement.method = 'POST';
    formElement.enctype = 'multipart/form-data';
    formElement.classList.add('confirmForm');

    for (const input of inputElements) {
        if (input.value.trim() == '') {
            alert(`Add something in ${input.name} section.`);
            return;
        }
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = input.name;
        hiddenInput.value = input.value || '';
        formElement.appendChild(hiddenInput);
    }

    const headTag = document.createElement('p');
    headTag.classList.add('confirmForm-heading');
    headTag.textContent = "Password Verification";
    formElement.appendChild(headTag);

    const pTag = document.createElement('p');
    pTag.classList.add('password-heading');
    pTag.textContent = "Enter your password to confirm that it's you";
    formElement.appendChild(pTag);

    const passTagContainer = document.createElement('div');
    passTagContainer.classList.add('input')
    passTagContainer.style.width = '100%'

    const passwordTag = document.createElement('input');
    passwordTag.type = 'password';
    passwordTag.name = 'password';
    passwordTag.classList.add('input-element');
    passwordTag.id = 'password';
    passwordTag.required = true;
    passwordTag.addEventListener('input', function () {
        // Check if input has value
        if (this.value) {
            this.classList.add('has-content');
        } else {
            this.classList.remove('has-content');
        }
    });
    passTagContainer.appendChild(passwordTag);

    const passwordLabel = document.createElement('label');
    passwordLabel.classList.add('input-label');
    passwordLabel.htmlFor = 'password';
    passwordLabel.textContent = 'Password';
    passTagContainer.appendChild(passwordLabel);

    formElement.appendChild(passTagContainer);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('confirm-submit-btn', 'save-btn');
    submitBtn.textContent = 'Submit';
    formElement.appendChild(submitBtn);

    const formBackGr = document.createElement('div');
    formBackGr.classList.add('form-background');
    formBackGr.appendChild(formElement)

    document.getElementById('setting').appendChild(formBackGr);

    window.addEventListener('click', closeEdit, true);

    formElement.addEventListener('submit', async (ev) => {
        ev.preventDefault(); // Prevent default form submission

        const formData = {};
        inputElements.forEach(input => {
            formData[`${input.name}`] = input.value;
        })

        formData.password = passwordTag.value;

        try {
            const response = await fetch(formElement.action, {
                method: formElement.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json(); // or response.text(), response.blob(), etc.

            // Handle the response data here
            alert(result.msg);
            formBackGr.click();
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form');
        }
    });
}

const closeEdit = (e) => {
    const clickArea = document.querySelector('.profile-container');
    const nonClickArea = document.querySelector('.confirmForm');
    if (clickArea.contains(e.target) && !nonClickArea.contains(e.target)) {
        window.removeEventListener('click', closeEdit, true);
        document.querySelector('.form-background').remove();
    }
}

/* Loading Animation Ends */
document.getElementById('loading').style.display = 'none';
document.body.style.overflowY = 'auto';

// Fetching products
// Function to fetch products from the server
function fetchFavourites() {
    fetch(`/api/favourite`)
        .then(response => response.json())
        .then(data => {
            if (data.length == 0) {
                return;
            }
            const productsDiv = document.getElementById(`favourite`);
            productsDiv.innerHTML = `<p class="fav-heading">Your Favourites</p>`; // Clear existing content
            console.log(data);
            data.forEach(product => {
                const searchDiv = document.createElement('div');
                searchDiv.setAttribute('onclick', `window.location.href = '/product?modelNo=${product.model_number}'`);
                searchDiv.classList.add('search-item');
                productsDiv.appendChild(searchDiv);

                const searchImgDiv = document.createElement('div');
                searchImgDiv.classList.add('search-image');
                const imageArr = product.image;
                const imageLocArr = Object.values(imageArr[0])[0];
                const imageTag = document.createElement('img');
                imageTag.classList.add('images');
                imageTag.src = `/static/productImg/${imageLocArr[0]}`;
                searchImgDiv.appendChild(imageTag);
                searchDiv.appendChild(searchImgDiv);

                const searchContDiv = document.createElement('div');
                searchContDiv.classList.add('search-content');
                
                if (product.product_type == 'Water Filter and Purifiers') {
                    let heading = '';
                    if (product.model_name && product.model_name.length) {
                        heading = product.model_name + ' based on ';
                        
                        // Check if filtration-method exists in product
                        if (product.filtration_method) {
                            product.filtration_method.forEach((method, i) => {
                                if (i == 0) {
                                    heading += method + ' ';
                                } else {
                                    heading += '+ ' + method;
                                }
                            });
                        }
                        
                        // Check if included-components exists in product
                        if (product.included_components) {
                            product.included_components.forEach((component, i) => {
                                if (i == 0) {
                                    heading += ' with ' + component + ' ';
                                } else {
                                    heading += ', ' + component;
                                }
                            });
                        }
                        
                        heading += ' and Automatic UF+TDS controller ';
                        
                        if (product.tank_capacity && product.tank_capacity >= 9) {
                            heading += 'having ' + product.tank_capacity + '-L Tank ';
                        }
                        
                        heading += 'by ' + product.brand_name;
                    } else {
                        heading = product.brand_name + ' Presents a Purifier based on ';
                        
                        // Check if filtration-method exists in product
                        if (product.filtration_method) {
                            product.filtration_method.forEach((method, i) => {
                                if (i == 0) {
                                    heading += method + ' ';
                                } else {
                                    heading += '+ ' + method;
                                }
                            });
                        }
                        
                        // Check if included-components exists in product
                        if (product.included_components) {
                            product.included_components.forEach((component, i) => {
                                if (i == 0) {
                                    heading += ' with ' + component + ' ';
                                } else {
                                    heading += ', ' + component;
                                }
                            });
                        }
                        
                        heading += ' and Automatic UF+TDS controller ';
                        
                        if (product.tank_capacity && product.tank_capacity >= 9) {
                            heading += 'having ' + product.tank_capacity + '-L Tank ';
                        }
                    }

                    const headingTag = document.createElement('p');
                    headingTag.classList.add('heading');
                    headingTag.textContent = heading;
                    searchContDiv.appendChild(headingTag);
                } else if (product.product_type == 'Water Filter Cabinet') {
                    let heading = '';
                    if (product.model_name && product.model_name.length) {
                        heading = 'Cabinet of ' + product.model_name + ' with ' + (product.tank_full_indicator || 'standard') + ' indicators ';
                        
                        if (product.tank_capacity && product.tank_capacity >= 7) {
                            heading += 'having ' + product.tank_capacity + '-L Tank ';
                        }
                        
                        heading += 'designed by ' + product.brand_name;
                    } else {
                        heading = 'Purifier Cabinet with ' + (product.tank_full_indicator || 'standard') + ' indicators ';
                        
                        if (product.tank_capacity && product.tank_capacity >= 7) {
                            heading += 'having ' + product.tank_capacity + '-L Tank ';
                        }
                    }

                    const headingTag = document.createElement('p');
                    headingTag.classList.add('heading');
                    headingTag.textContent = heading;
                    searchContDiv.appendChild(headingTag);
                } else {
                    // Default heading for other product types
                    const headingTag = document.createElement('p');
                    headingTag.classList.add('heading');
                    headingTag.textContent = `${product.model_name} by ${product.brand_name}`;
                    searchContDiv.appendChild(headingTag);
                }

                /* ADDING OTHER DETAILS. */
                const ratingTag = document.createElement('p');
                ratingTag.classList.add('rating');
                ratingTag.innerHTML = '';
                let ratingCount = product.rating && product.rating.overall ? Math.round(product.rating.overall) : 0;
                for (let i = 0; i < ratingCount; i++) {
                    let temp = ratingTag.innerHTML;
                    ratingTag.innerHTML = `${temp}
                        <ion-icon name="star"></ion-icon>`;
                }
                for (let i = ratingCount; i < 5; i++) {
                    let temp = ratingTag.innerHTML;
                    ratingTag.innerHTML = `${temp}
                        <ion-icon name="star-outline"></ion-icon>`;
                }
                searchContDiv.appendChild(ratingTag);

                const priceTag = document.createElement('p');
                priceTag.classList.add('price');
                const discountedPrice = product.discount ? 
                    product.price - (product.price * product.discount / 100) : 
                    product.price;
                priceTag.innerHTML = `
                    <sup>&#x20B9</sup>
                    <span>${discountedPrice}</span>
                    <label>M.R.P : <span>&#x20B9 ${product.price}</span> ${product.discount ? `(${product.discount}% discount)` : ''}</label>`;
                searchContDiv.appendChild(priceTag);

                const brandTag = document.createElement('p');
                brandTag.classList.add('brand', 'points');
                brandTag.innerHTML = `<ion-icon name="business"></ion-icon> 
                    <span>${product.brand_name}</span>`;
                searchContDiv.appendChild(brandTag);

                if (product.warranty) {
                    const warrantyTag = document.createElement('p');
                    warrantyTag.classList.add('warranty', 'points');
                    warrantyTag.innerHTML = `<ion-icon name="shield-checkmark"></ion-icon> 
                        <span> ${product.warranty} Years Of Warranty</span>`;
                    searchContDiv.appendChild(warrantyTag);
                } else if (product.color && product.color.length > 1) {
                    const multiTag = document.createElement('p');
                    multiTag.classList.add('multicolor', 'points');
                    multiTag.innerHTML = `<ion-icon name="aperture"></ion-icon> 
                        <span> Multicolor Available </span>`;
                    searchContDiv.appendChild(multiTag);
                }

                // Add stages information if available in product details
                if (product.stages) {
                    const stagesTag = document.createElement('p');
                    stagesTag.classList.add('stages', 'points');
                    stagesTag.innerHTML = `<ion-icon name="water"></ion-icon> 
                        <span> ${product.stages} Stage Purification</span>`;
                    searchContDiv.appendChild(stagesTag);
                } else {
                    // Add material information as fallback
                    const materialTag = document.createElement('p');
                    materialTag.classList.add('material', 'points');
                    materialTag.innerHTML = `<ion-icon name="cube"></ion-icon> 
                        <span> Material: ${product.material}</span>`;
                    searchContDiv.appendChild(materialTag);
                }

                const deliveryTag = document.createElement('p');
                deliveryTag.classList.add('delivery', 'points');
                deliveryTag.innerHTML = `<ion-icon name="bus"></ion-icon> 
                    <span> Free Delivery</span>`;
                searchContDiv.appendChild(deliveryTag);

                searchDiv.appendChild(searchContDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders'); // Adjust the URL as needed
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day}-${month}-${year}, ${hours}:${formattedMinutes} ${ampm}`;
}

function createOrderElement(order) {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-container');
    orderContainer.setAttribute('onclick', `window.location.href='/order/status?orderId=${order.orderId}'`);

    const orderLeft = document.createElement('div');
    orderLeft.classList.add('order-left');

    const orderDetail = document.createElement('div');
    orderDetail.classList.add('order-detail');

    const orderId = document.createElement('p');
    orderId.classList.add('order-id');
    orderId.textContent = `Order#: ${order.orderId}`;

    const orderDate = document.createElement('p');
    orderDate.classList.add('order-date');
    orderDate.textContent = formatDate(order.orderDate);

    orderDetail.appendChild(orderId);
    orderDetail.appendChild(orderDate);
    orderLeft.appendChild(orderDetail);

    if (order.orderStage >= 1 && order.orderStage < 5) {
        const orderDelivery = document.createElement('p');
        orderDelivery.classList.add('order-delivery');
        orderDelivery.textContent = `Estimated delivery on 25 May`; // Customize as needed
        orderLeft.appendChild(orderDelivery);
    } else if (order.orderStage == 5) {
        const orderDelivery = document.createElement('p');
        orderDelivery.classList.add('order-delivery');
        orderDelivery.textContent = `Delivered on 25 May`; // Customize as needed
        orderLeft.appendChild(orderDelivery);
    } else if (order.orderStage == 0) {
        const orderDelivery = document.createElement('p');
        orderDelivery.classList.add('order-delivery');
        orderDelivery.textContent = `Cancelled on 25 May`;
        orderLeft.appendChild(orderDelivery);
    }


    const orderRight = document.createElement('div');
    orderRight.classList.add('order-right');

    const orderImg = document.createElement('div');
    orderImg.classList.add('order-img');

    const img = document.createElement('img');
    img.src = '/static/productImg/' + order.image;
    img.alt = '';

    orderImg.appendChild(img);
    orderRight.appendChild(orderImg);

    if (order.orderStage >= 1 && order.orderStage < 5) {
        const orderPayStatus = document.createElement('p');
        orderPayStatus.classList.add('order-pay-status');
        orderPayStatus.textContent = order.payStatus;
        orderRight.appendChild(orderPayStatus);
    } else if (order.orderStage == 5) {
        const orderPayStatus = document.createElement('p');
        orderPayStatus.classList.add('order-rated');
        orderPayStatus.innerHTML = `You Rated : 
            <ion-icon name="star"></ion-icon> 
            <ion-icon name="star"></ion-icon> 
            <ion-icon name="star"></ion-icon> 
            <ion-icon name="star"></ion-icon> 
            <ion-icon name="star-outline"></ion-icon> `;
        orderRight.appendChild(orderPayStatus); // Customize as needed
    } else if(order.orderStage == 0){
        const orderPayStatus = document.createElement('p');
        orderPayStatus.classList.add('order-pay-status');
        orderPayStatus.textContent = order.payStatus;
        orderRight.appendChild(orderPayStatus);
    }

    orderContainer.appendChild(orderLeft);
    orderContainer.appendChild(orderRight);

    return orderContainer;
}

function displayOrders(orders) {
    const allOrders = document.getElementById('All-orders'); // Adjust the container ID as needed
    const onGoing = document.getElementById('Ongoing-orders');
    const deliveredOrders = document.getElementById('Delivered-orders');
    const cancelledOrders = document.getElementById('Cancelled-orders');
    orders.forEach(order => {
        const orderElement = createOrderElement(order);
        allOrders.appendChild(orderElement);

        // Create a clone of the order element for other sections
        const orderElementClone = orderElement.cloneNode(true);
        if (order.orderStage >= 1 && order.orderStage < 5) {
            onGoing.appendChild(orderElementClone);
        } else if (order.orderStage == 5) {
            deliveredOrders.appendChild(orderElementClone);
        } else if (order.orderStage == 0) {
            cancelledOrders.appendChild(orderElementClone);
        }
    });
}

// Initialize the observer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchFavourites();
    fetchOrders();
});