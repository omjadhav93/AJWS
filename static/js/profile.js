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

// Fetching products
// Function to fetch products from the server
function fetchProducts(sectionId) {
    fetch(`/api/${sectionId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length == 0) {
                return;
            }
            const productsDiv = document.getElementById(`${sectionId}`);
            productsDiv.innerHTML = ''; // Clear existing content
            data.forEach(product => {
                const searchDiv = document.createElement('div');
                searchDiv.setAttribute('onclick', `window.location.href = '/product?modelNo=${product['model-number']}'`);
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
                /* ADDING HEADING OF THE PRODUCT */
                if (product['product-type'] == 'Water Filter and Purifiers') {
                    let heading = '';
                    if (product['model-name'].length) {
                        heading = product['model-name'] + ' based on ';
                        product['filteration-method'].forEach((method, i) => {
                            if (i == 0) {
                                heading += method + ' ';
                            } else {
                                heading += '+ ' + method;
                            }
                        });
                        product['included-components'].forEach((component, i) => {
                            if (i == 0) {
                                heading += ' with ' + component + ' ';
                            } else {
                                heading += ', ' + component;
                            }
                        });
                        heading += ' and Automatic UF+TDS controller ';
                        if (product['tank-capacity'] && product['tank-capacity'] >= 9) {
                            heading += 'having ' + product['tank-capacity'] + '-L Tank ';
                        }
                        heading += 'by ' + product['brand-name'];
                    } else {
                        heading = product['brand-name'] + ' Presents a Purifier based on ';
                        product['filteration-method'].forEach((method, i) => {
                            if (i == 0) {
                                heading += method + ' ';
                            } else {
                                heading += '+ ' + method;
                            }
                        });
                        product['included-components'].forEach((component, i) => {
                            if (i == 0) {
                                heading += ' with ' + component + ' ';
                            } else {
                                heading += ', ' + component;
                            }
                        });
                        heading += ' and Automatic UF+TDS controller ';
                        if (product['tank-capacity'] && product['tank-capacity'] >= 9) {
                            heading += 'having ' + product['tank-capacity'] + '-L Tank ';
                        }
                    }

                    const headingTag = document.createElement('p');
                    headingTag.classList.add('heading');
                    headingTag.textContent = heading;
                    searchContDiv.appendChild(headingTag);
                } else if (product['product-type'] == 'Water Filter Appliances' && product['filter-part'] == 'Cabinet') {
                    let heading = '';
                    if (product['model-name'].length) {
                        heading = product['filter-type'] + ' of ' + product['model-name'] + ' with ' + product['tank-full-indicator'] + ' indicators ';
                        if (product['tank-capacity'] && product['tank-capacity'] >= 7) {
                            heading += 'having ' + product['tank-capacity'] + '-L Tank ';
                        }
                        heading += 'by ' + product['brand-name'];
                    } else {
                        heading = 'Purifier ' + product['filter-type'] + ' with ' + product['tank-full-indicator'] + ' indicators ';
                        if (product['tank-capacity'] && product['tank-capacity'] >= 7) {
                            heading += 'having ' + product['tank-capacity'] + '-L Tank ';
                        }
                        heading += ' designed by ' + product['brand-name'];
                    }

                    const headingTag = document.createElement('p');
                    headingTag.classList.add('heading');
                    headingTag.textContent = heading;
                    searchContDiv.appendChild(headingTag);
                }

                /* ADDING OTHER DETAILS. */
                const ratingTag = document.createElement('p');
                ratingTag.classList.add('rating');
                ratingTag.innerHTML = '';
                let ratingCount = product['rating-list'].overall;
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
                priceTag.innerHTML = `
                    <sup>&#x20B9</sup>
                    <span>${(product['originalPrice']) - ((product['originalPrice']) * (product['discount']) / 100)}</span>
                    <label>M.R.P : <span>&#x20B9 ${product['originalPrice']}</span> (${product['discount']}% discount)</label>`;
                searchContDiv.appendChild(priceTag);

                const brandTag = document.createElement('p');
                brandTag.classList.add('brand', 'points');
                brandTag.innerHTML = `<ion-icon name="business"></ion-icon> 
                    <span>${product['brand-name']}</span>`;
                searchContDiv.appendChild(brandTag);

                if (product['warranty']) {
                    const warrantyTag = document.createElement('p');
                    warrantyTag.classList.add('warranty', 'points');
                    warrantyTag.innerHTML = `<ion-icon name="shield-checkmark"></ion-icon> 
                        <span> ${product['warranty-count']} Years Of Waranty</span>`;
                    searchContDiv.appendChild(warrantyTag);
                } else if (product['color'].length > 1) {
                    const multiTag = document.createElement('p');
                    multiTag.classList.add('multicolor', 'points');
                    multiTag.innerHTML = `<ion-icon name="aperture"></ion-icon> 
                        <span> Multicolor Available </span>`;
                    searchContDiv.appendChild(multiTag);
                }

                const stagesTag = document.createElement('p');
                stagesTag.classList.add('stages', 'points');
                stagesTag.innerHTML = `<ion-icon name="water"></ion-icon> 
                    <span> ${product['stages']} Stage Purification</span>`;
                searchContDiv.appendChild(stagesTag);

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

// Initialize the observer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts('favourite');
});
