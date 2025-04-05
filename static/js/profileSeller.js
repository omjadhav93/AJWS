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

/* Loading Animation Ends */
document.getElementById('loading').style.display = 'none';
document.body.style.overflowY = 'auto';

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
        deleteInput.value = item._id;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'submit';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => confirm('Are you sure you want to delete this Product?');
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
            unavailButton.onclick = () => confirm('Do you want to mark this product unavailable?');
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
            availButton.onclick = () => confirm('Do you want to mark this product available?');
            availButton.textContent = 'Available';
            availForm.appendChild(availInput);
            availForm.appendChild(availButton);
            btnList.appendChild(availForm);
        }



        searchContent.appendChild(btnList);

        // Product Details
        const heading = document.createElement('p');
        heading.className = 'heading';

        if (item.product_type === 'Water Filter and Purifiers') {
            if (item.model_name && item.model_name.length) {
                heading.textContent = `${item.model_name} based on `;
                
                // Check if filtration_method exists in item
                if (item.filtration_method) {
                    item.filtration_method.forEach((method, i) => {
                        heading.textContent += (i === 0 ? method : `+ ${method}`);
                    });
                }
                
                heading.textContent += ' Technique ';
                
                // Check if included_components exists in item
                if (item.included_components) {
                    item.included_components.forEach((component, i) => {
                        heading.textContent += (i === 0 ? `with ${component}` : `, ${component}`);
                    });
                }
                
                heading.textContent += ' and Automatic UF+TDS controller ';
                
                if (item.tank_capacity) {
                    heading.textContent += `having ${item.tank_capacity}-L Tank `;
                }
                
                heading.textContent += `by ${item.brand_name}`;
            } else {
                heading.textContent = `${item.brand_name} Presents a Purifier based on `;
                
                // Check if filteration_method exists in item
                if (item.filteration_method) {
                    item.filteration_method.forEach((method, i) => {
                        heading.textContent += (i === 0 ? method : `+ ${method}`);
                    });
                }
                
                heading.textContent += ' Technique ';
                
                // Check if included_components exists in item
                if (item.included_components) {
                    item.included_components.forEach((component, i) => {
                        heading.textContent += (i === 0 ? `with ${component}` : `, ${component}`);
                    });
                }
                
                heading.textContent += ' and Automatic UF+TDS controller ';
                
                if (item.tank_capacity) {
                    heading.textContent += `having ${item.tank_capacity}-L Tank `;
                }
            }
        } else if (item.product_type === 'Water Filter Cabinet') {
            if (item.model_name && item.model_name.length) {
                heading.textContent = `Cabinet of ${item.model_name} with ${item.tank_full_indicator || 'standard'} indicators `;
                
                if (item.tank_capacity) {
                    heading.textContent += `having ${item.tank_capacity}-L Tank `;
                }
                
                heading.textContent += `designed by ${item.brand_name}`;
            } else {
                heading.textContent = `Purifier Cabinet with ${item.tank_full_indicator || 'standard'} indicators `;
                
                if (item.tank_capacity) {
                    heading.textContent += `having ${item.tank_capacity}-L Tank `;
                }
                
                heading.textContent += `designed by ${item.brand_name}`;
            }
        } else {
            // Default heading for other product types
            heading.textContent = `${item.model_name} by ${item.brand_name}`;
        }
        searchContent.appendChild(heading);

        // Other Product Info
        const rating = document.createElement('p');
        rating.className = 'rating';
        // Update rating display to use the new rating structure
        let ratingValue = item.rating && item.rating.overall ? Math.round(item.rating.overall) : 0;
        rating.innerHTML = '';
        for (let i = 0; i < ratingValue; i++) {
            rating.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>`;
        }
        for (let i = ratingValue; i < 5; i++) {
            rating.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>`;
        }
        searchContent.appendChild(rating);

        const price = document.createElement('p');
        price.className = 'price';
        const discountedPrice = item.discount ? 
            item.price - (item.price * item.discount / 100) : 
            item.price;
        price.innerHTML = `<sup>&#x20B9;</sup><span>${discountedPrice}</span> <label>M.R.P : <span>&#x20B9;${item.price}</span> ${item.discount ? `(${item.discount}% discount)` : ''}</label>`;
        searchContent.appendChild(price);

        const brandPoints = document.createElement('p');
        brandPoints.className = 'brand points';
        brandPoints.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z"/>
              <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z"/>
            </svg>
            <span>${item.brand_name}</span>`;
        searchContent.appendChild(brandPoints);

        if (item.warranty) {
            const warrantyTag = document.createElement('p');
            warrantyTag.className = 'warranty points';
            warrantyTag.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-check" viewBox="0 0 16 16">
                  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                </svg>
                <span>${item.warranty} Years Of Warranty</span>`;
            searchContent.appendChild(warrantyTag);
        } else if (item.color && item.color.length > 1) {
            const multicolor = document.createElement('p');
            multicolor.className = 'multicolor points';
            multicolor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
                  <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7"/>
                </svg>
                <span>Multicolor Available</span>`;
            searchContent.appendChild(multicolor);
        }

        // Add stages information if available in product details
        if (item.stages) {
            const stages = document.createElement('p');
            stages.className = 'stages points';
            stages.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-water" viewBox="0 0 16 16">
                  <path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65"/>
                </svg>
                <span>${item.stages} Stage Purification</span>`;
            searchContent.appendChild(stages);
        } else {
            // Add material information as fallback
            const material = document.createElement('p');
            material.className = 'material points';
            material.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16">
                  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                </svg>
                <span>Material: ${item.material}</span>`;
            searchContent.appendChild(material);
        }

        const delivery = document.createElement('p');
        delivery.className = 'delivery points';
        delivery.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
            </svg>
            <span>Free Delivery</span>`;
        searchContent.appendChild(delivery);

        const modelNumber = document.createElement('label');
        modelNumber.setAttribute('for', 'keyword');
        modelNumber.className = 'model-number';
        modelNumber.textContent = item.model_number;
        searchContent.appendChild(modelNumber);

        const productType = document.createElement('label');
        productType.setAttribute('for', 'keyword');
        productType.className = 'product-type';
        productType.textContent = item.product_type;
        searchContent.appendChild(productType);

        const materialLabel = document.createElement('label');
        materialLabel.setAttribute('for', 'keyword');
        materialLabel.className = 'material';
        materialLabel.textContent = item.material;
        searchContent.appendChild(materialLabel);

        if (item.color) {
            item.color.forEach(color => {
                const colorLabel = document.createElement('label');
                colorLabel.setAttribute('for', 'keyword');
                colorLabel.textContent = `${color}, `;
                searchContent.appendChild(colorLabel);
            });
        }

        const tankCapacity = document.createElement('label');
        tankCapacity.setAttribute('for', 'keyword');
        tankCapacity.className = 'tank-capacity';
        // Check if tank_capacity exists in item
        if (item.tank_capacity) {
            tankCapacity.textContent = `${item.tank_capacity} Liters`;
        } else {
            tankCapacity.textContent = 'Tank capacity not specified';
        }
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

function openProduct(e) {
    const modelNo = e.getElementsByClassName('model-number')[0].textContent
    window.location.href = `/product?modelNo=${modelNo}`
}