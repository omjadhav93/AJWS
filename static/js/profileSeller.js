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

const productList = document.querySelectorAll('.list-item');

productList.forEach((list, i) => {
    list.style.transform = `translateX(${i * 100}%)`;
})

const changeList = (index) => {
    productList.forEach((list, i) => {
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

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/seller/products') 
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error fetching data:', error));
    fetch('/api/brands') 
        .then(response => response.json())
        .then(data => createBrandElements(data))
        .catch(error => console.error('Error fetching data:', error));
});

function createBrandElements(brands) {
    const brandsContainer = document.getElementById('brands-list');

    brands.forEach(brand => {
        const brandContainer = document.createElement('div');
        brandContainer.className = 'brand-container';
        brandContainer.setAttribute('onclick','window.location.href = "/brands"')

        const brandImage = document.createElement('div');
        brandImage.className = 'brand-image';
        const img = document.createElement('img');
        img.src = '/' + brand.logoUrl;
        img.alt = brand.name;
        brandImage.appendChild(img);

        const brandName = document.createElement('div');
        brandName.className = 'brand-name';
        const p = document.createElement('p');
        p.textContent = brand.name;
        brandName.appendChild(p);

        brandContainer.appendChild(brandImage);
        brandContainer.appendChild(brandName);

        brandsContainer.appendChild(brandContainer);
    });
}

function renderProducts(data) {
    const allProductsContainer = document.getElementById('All-products');
    const availableProducts = document.getElementById('Available');
    const unAvailableProducts = document.getElementById('Unavailable');

    data.forEach(item => {
        const productItem = document.createElement('div');
        productItem.className = 'search-item';
        productItem.onclick = () => openProduct(productItem);

        // Image Section
        const searchImage = document.createElement('div');
        searchImage.className = 'search-image';
        const imageArr = item.image;
        const imageLocArr = Object.values(imageArr[0])[0];
        const imgElement = document.createElement('img');
        imgElement.className = 'images';
        imgElement.src = `/static/productImg/${imageLocArr[0]}`;
        searchImage.appendChild(imgElement);

        // Content Section
        const searchContent = document.createElement('div');
        searchContent.className = 'search-content';

        // Buttons
        const btnList = document.createElement('div');
        btnList.className = 'btn-list';

        const deleteForm = document.createElement('form');
        deleteForm.action = "/user/product/delete";
        deleteForm.method = "post";
        const deleteInput = document.createElement('input');
        deleteInput.type = 'hidden';
        deleteInput.name = 'itemId';
        deleteInput.value = item.id;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'submit';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => confirm('Are you sure you want to delete this Product');
        deleteButton.textContent = 'Delete';
        deleteForm.appendChild(deleteInput);
        deleteForm.appendChild(deleteButton);
        btnList.appendChild(deleteForm);

        if (item.available) {
            const unavailForm = document.createElement('form');
            unavailForm.action = "/user/product/unavailable";
            unavailForm.method = "post";
            const unavailInput = document.createElement('input');
            unavailInput.type = 'hidden';
            unavailInput.name = 'itemId';
            unavailInput.value = item._id;
            const unavailButton = document.createElement('button');
            unavailButton.type = 'submit';
            unavailButton.className = 'unavail-btn';
            unavailButton.textContent = 'Unavailable';
            unavailForm.appendChild(unavailInput);
            unavailForm.appendChild(unavailButton);
            btnList.appendChild(unavailForm);
        } else {
            const availForm = document.createElement('form');
            availForm.action = "/user/product/available";
            availForm.method = "post";
            const availInput = document.createElement('input');
            availInput.type = 'hidden';
            availInput.name = 'itemId';
            availInput.value = item._id;
            const availButton = document.createElement('button');
            availButton.type = 'submit';
            availButton.className = 'avail-btn';
            availButton.textContent = 'Available';
            availForm.appendChild(availInput);
            availForm.appendChild(availButton);
            btnList.appendChild(availForm);
        }



        searchContent.appendChild(btnList);

        // Product Details
        const heading = document.createElement('p');
        heading.className = 'heading';

        if (item['product-type'] === 'Water Filter and Purifiers') {
            if (item['model-name'].length) {
                heading.textContent = `${item['model-name']} based on `;
                item['filteration-method'].forEach((method, i) => {
                    heading.textContent += (i === 0 ? method : `+ ${method}`);
                });
                heading.textContent += ' Technique ';
                item['included-components'].forEach((component, i) => {
                    heading.textContent += (i === 0 ? `with ${component}` : `, ${component}`);
                });
                heading.textContent += ' and Automatic UF+TDS controller ';
                if (item['tank-capacity']) {
                    heading.textContent += `having ${item['tank-capacity']}-L Tank `;
                }
                heading.textContent += `by ${item['brand-name']}`;
            } else {
                heading.textContent = `${item['brand-name']} Presents a Purifier based on `;
                item['filteration-method'].forEach((method, i) => {
                    heading.textContent += (i === 0 ? method : `+ ${method}`);
                });
                heading.textContent += ' Technique ';
                item['included-components'].forEach((component, i) => {
                    heading.textContent += (i === 0 ? `with ${component}` : `, ${component}`);
                });
                heading.textContent += ' and Automatic UF+TDS controller ';
                if (item['tank-capacity']) {
                    heading.textContent += `having ${item['tank-capacity']}-L Tank `;
                }
            }
        } else if (item['product-type'] === 'Water Filter Appliances' && req.body['filter-part'] === 'Cabinet') {
            if (item['model-name'].length) {
                heading.textContent = `${item['filter-type']} of ${item['model-name']} with ${item['tank-full-indicator']} indicators `;
                if (item['tank-capacity']) {
                    heading.textContent += `having ${item['tank-capacity']}-L Tank `;
                }
                heading.textContent += `designed by ${item['brand-name']}`;
            } else {
                heading.textContent = `Purifier ${item['filter-type']} with ${item['tank-full-indicator']} indicators `;
                if (item['tank-capacity']) {
                    heading.textContent += `having ${item['tank-capacity']}-L Tank `;
                }
                heading.textContent += `designed by ${item['brand-name']}`;
            }
        }
        searchContent.appendChild(heading);

        // Other Product Info
        const rating = document.createElement('p');
        rating.className = 'rating';
        rating.textContent = item.rating;
        searchContent.appendChild(rating);

        const price = document.createElement('p');
        price.className = 'price';
        price.innerHTML = `<sup>&#x20B9;</sup><span>${item['originalPrice'] - (item['originalPrice'] * item['discount'] / 100)}</span> <label>M.R.P : <span>&#x20B9;${item['originalPrice']}</span> (${item['discount']}% discount)</label>`;
        searchContent.appendChild(price);

        const brandPoints = document.createElement('p');
        brandPoints.className = 'brand points';
        brandPoints.innerHTML = `<ion-icon name="business"></ion-icon> <span>${item['brand-name']}</span>`;
        searchContent.appendChild(brandPoints);

        if (item['waranty']) {
            const waranty = document.createElement('p');
            waranty.className = 'waranty points';
            waranty.innerHTML = `<ion-icon name="shield-checkmark"></ion-icon> <span>${item['waranty-count']} Of Waranty</span>`;
            searchContent.appendChild(waranty);
        } else if (item['color'].length > 1) {
            const multicolor = document.createElement('p');
            multicolor.className = 'multicolor points';
            multicolor.innerHTML = `<ion-icon name="aperture"></ion-icon> <span>Multicolor Available</span>`;
            searchContent.appendChild(multicolor);
        }

        const stages = document.createElement('p');
        stages.className = 'stages points';
        stages.innerHTML = `<ion-icon name="water"></ion-icon> <span>${item['stages']} Stage Purification</span>`;
        searchContent.appendChild(stages);

        const delivery = document.createElement('p');
        delivery.className = 'delivery points';
        delivery.innerHTML = `<ion-icon name="bus"></ion-icon> <span>Free Delivery</span>`;
        searchContent.appendChild(delivery);

        const modelNumber = document.createElement('label');
        modelNumber.setAttribute('for', 'keyword');
        modelNumber.className = 'model-number';
        modelNumber.textContent = item['model-number'];
        searchContent.appendChild(modelNumber);

        const productType = document.createElement('label');
        productType.setAttribute('for', 'keyword');
        productType.className = 'product-type';
        productType.textContent = item['product-type'];
        searchContent.appendChild(productType);

        const material = document.createElement('label');
        material.setAttribute('for', 'keyword');
        material.className = 'material';
        material.textContent = item['material'];
        searchContent.appendChild(material);

        item['color'].forEach(color => {
            const colorLabel = document.createElement('label');
            colorLabel.setAttribute('for', 'keyword');
            colorLabel.textContent = `${color}, `;
            searchContent.appendChild(colorLabel);
        });

        const tankCapacity = document.createElement('label');
        tankCapacity.setAttribute('for', 'keyword');
        tankCapacity.className = 'tank-capacity';
        tankCapacity.textContent = `${item['tank-capacity']} Liters`;
        searchContent.appendChild(tankCapacity);

        productItem.appendChild(searchImage);
        productItem.appendChild(searchContent);
        allProductsContainer.appendChild(productItem);

        const copyProductItem = productItem.cloneNode(true);
        if (item.available) {
            availableProducts.appendChild(copyProductItem);
        } else {
            unAvailableProducts.appendChild(copyProductItem);
        }
    });
}

function openProduct(element) {
    const modelNo = e.getElementsByClassName('model-number')[0].textContent
    window.location.href = `/product?modelNo=${modelNo}`
}