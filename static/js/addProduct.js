const sameHeight = document.querySelectorAll('.same-height')

let maxHeight = 0;
sameHeight.forEach(element => {
    const height = element.offsetHeight;
    if (height > maxHeight) {
        maxHeight = height;
    }
});

sameHeight.forEach((element, i) => {
    element.style.height = maxHeight + 'px';
});

/* Loading Animation Ends */
document.getElementById('loading').style.display = 'none';
document.body.style.overflowY = 'auto';

/* Setting options for product type and product */
const category = {
    'Home and Kitchen Appliances': ['Water Filter and Purifiers', 'Water Filter Cabinet'],
}

const product = {
    'Water Filter and Purifiers': `<p class="que subQueCategory">What type of water filter is this ?</p>
    <div class="radio-section subQueCategory" style="margin-top: 0;">
      <input type="radio" class="radio" name="filter_type" value="Domestic" id="filter-type-domestic" required/>
      <label for="filter-type-domestic" class="radio-label"> Domestic</label><br/>
      <input type="radio" class="radio" name="filter_type" value="Commercial" id="filter-type-commercial" required/>
      <label for="filter-type-commercial" class="radio-label"> Commercial</label><br/>
      <input type="radio" class="radio" name="filter_type" value="Industrial" id="filter-type-industrial" required/>
      <label for="filter-type-industrial" class="radio-label"> Industrial</label><br/>
    </div>
  `
}

function productHintFinder(productType) {
    if (productType == 'Water Filter and Purifiers') {
        const selectedFilter = document.querySelector('input[name="filter_type"]:checked');
        return selectedFilter ? selectedFilter.value : 'Domestic'; // Default to Domestic if nothing selected
    } else if (productType == 'Water Filter Cabinet') {
        return 'Cabinet';
    }
}

const subQueAns = {
    Domestic: ['filtration-method', 'tank', 'included-components', 'filtration-stages'],
    Commercial: ['filtration-method', 'included-components', 'filtration-stages'],
    Industrial: ['filtration-method', 'included-components', 'filtration-stages'],
    Cabinet: ['tank-full-indicator', 'tank']
}

const queData = {
    'filtration-method': `<p class="que">Which type of filtration method is used in your product?</p>
    <div class="checkbox-options">
      <div class="method">
        <input type="checkbox" name="filtration_method" value="RO" id="RO"/>
        <label for="RO">RO</label
      </div>
      <div class="method">
        <input type="checkbox" name="filtration_method" value="UV" id="UV"/>
        <label for="UV">UV</label
      </div>
      <div class="method">
        <input type="checkbox" name="filtration_method" value="Gravity Separation" id="GS"/>
        <label for="GS">Gravity Separation</label
      </div>
    </div>`,
    tank: `<p class="que">What is the tank capacity ?</p>
      <input type="number" min="0" name="tank_capacity" id="tank-capacity" class="text-input" placeholder="Measured in liters" required/>
    `,
    'included-components': `<p class="que">Which additional components are present in your product ? (Except Sediment, Carbon, S.valve, Pump, Membrane)</p>
    <div class="checkbox-options">  
    <div class="include-component"> 
        <input type="checkbox" name="included_components" value="Mineral" id="Mineral"/>
        <label for="Mineral">Mineral</label>
      </div>
      <div class="include-component"> 
        <input type="checkbox" name="included_components" value="Copper" id="Copper"/>
        <label for="Copper">Copper</label>
      </div>
      <div class="include-component"> 
        <input type="checkbox" name="included_components" value="Alkaline" id="Alkaline"/>
        <label for="Alkaline">Alkaline</label>
      </div>
      <div class="include-component"> 
        <input type="text" name="included_components" class="text-input" placeholder="Other" style="font-size:17px;padding:5px;padding-top:0px"/>
      </div>
    </div>
      `,
    'filtration-stages': `<p class="que">No. of Stages in purification process. </p>
      <div class="radio-section">
        <input type="number" min="0" name="filtration_stages" class="text-input" id="filtration-stages-count" required/>
        <label> Stage Purification</label>
      <div>`,
    'tank-full-indicator': `<p class="que">Which type of tank full indicators are present in your product?</p>
        <div class="radio-section">
            <input type="radio" class="radio" name="tank_full_indicator" value="light bulbs" id="tank-full-bulb" required/>
            <label for="tank-full-bulb" class="radio-label"> Light bulbs</label><br/>
            <input type="radio" class="radio" name="tank_full_indicator" value="light bars" id="tank-full-bars" required/>
            <label for="tank-full-bars" class="radio-label"> Light bars</label><br/>
            <input type="radio" class="radio" name="tank_full_indicator" value="digital" id="tank-full-digital" required/>
            <label for="tank-full-digital" class="radio-label"> Digital</label><br/>
        </div>`
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

const productSelected = (value) => {
    // Remove past questions if any. 
    const subQueCategory = document.querySelectorAll('.subQueCategory');
    subQueCategory.forEach(que => {
        que.remove();
    })

    // Set new question as per product.
    if (value) {
        const productQuestion = product[value];
        const finalHtml = document.querySelector('#category-container').innerHTML + productQuestion
        document.querySelector('#category-container').innerHTML = finalHtml;
    }


}

/* i button text */
const iButton = (e,text) => {
    if(e.parentElement.querySelector('.iBox')){
        e.parentElement.querySelector('.iBox').remove();
        return;
    }
    const iBoxDiv = document.createElement('div');
    iBoxDiv.classList.add('iBox')
    iBoxDiv.textContent = text;
    e.parentElement.appendChild(iBoxDiv);
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
    } else if (target.getAttribute('id') == 'product-type') {
        productSelected(value);
    }
}

window.addEventListener('click', function (e) {
    const selectBtns = document.querySelectorAll('.selectOptBtn');
    selectBtns.forEach(btn => {
        if (!btn.contains(e.target) && !btn.querySelector("#selectOptContainer").classList.contains("addOption")) {
            openOption(btn);
        }
    })

    const iBoxes = document.querySelectorAll('.iBox');
    iBoxes.forEach(box => {
        if(!box.contains(e.target) && !box.previousElementSibling.contains(e.target)){
            iButton(box.previousElementSibling,'');
        }
    })
});

// Discount calculator
const discountChange = () => {
    let currDiscount = document.querySelector('input[name="discount"]').value;
    if (currDiscount < 0 || currDiscount > 100) {
        alert("Please add a valid discount value.");
        document.querySelector('input[name="discount"]').value = null;
        priceDisplay.parentElement.classList.add('final-price');
        return;
    }

    if (currDiscount) {
        document.getElementById('price-value').setAttribute('onkeyup', 'discountChange()')
    } else {
        document.getElementById('price-value').removeAttribute('onkeyup')
        priceDisplay.parentElement.classList.add('final-price');
        return;
    }

    const priceDisplay = document.getElementById('final-price-count')

    let marketPrice = document.getElementById('price-value').value;
    let ans = marketPrice - (marketPrice * currDiscount / 100);

    priceDisplay.innerText = ans + ' Rs';
    priceDisplay.parentElement.classList.remove('final-price');
}

const fileSection = () => {
    const prevHtml = document.querySelector('.color-not-selected');
    if (prevHtml) {
        prevHtml.remove();
    }

    const colors = document.querySelectorAll('input[name="color"]:checked')
    const appendLoc = document.getElementById('images');

    let colorList = [];
    // Creating new color boxes
    colors.forEach(color => {
        colorList.push(`${color.value}`);
        const inputBtn = document.querySelectorAll(`input[name='${color.value}-image']`);
        if (inputBtn.length > 0) {
            return;
        }
        const newDiv = document.createElement('div');
        newDiv.classList = "image-box";
        newDiv.innerHTML = `<p class="que">Add images of product for ${color.value} color :</p>
            <div class="image-adding-section">
                <input type="file" name="${color.value}-image" class="file-input-tag" onchange="checkFile(this)" accept="image/*" multiple/>
                <div class="add-option" onclick="takeInput('${color.value}')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                    </svg>
                </div>
            </div>`;

        appendLoc.appendChild(newDiv);
    })

    // Delete Previously selected but not now.
    const imageBoxes = document.querySelectorAll('.image-box');
    imageBoxes.forEach(box => {
        const colorName = box.querySelector('input[type="file"]').getAttribute('name');
        if (!(colorList.indexOf(colorName.slice(0, colorName.indexOf('-'))) >= 0)) {
            box.remove();
        }
    })
}

const takeInput = color => {
    const inputBtn = document.querySelectorAll(`input[name='${color}-image']`);
    let imgLen = 0;
    inputBtn.forEach(btn => {
        imgLen += btn.files.length;
    })
    if (imgLen > 5) {
        alert("You can upload only 5 images for each color")
        return;
    }
    inputBtn[inputBtn.length - 1].click();
}

const checkFile = (e) => {
    const inputBtn = document.querySelectorAll(`input[name='${e.name}']`);
    let imgLen = 0;
    inputBtn.forEach(btn => {
        imgLen += btn.files.length;
    })
    if (imgLen > 5) {
        alert("You can upload only 5 images for each color")
        e.value = "";
        return;
    }

    const addImageLoc = e.parentElement.querySelector('.add-option');

    const newDiv = document.createElement('div');
    newDiv.classList = "image-cover";
    let height = addImageLoc.offsetHeight;
    newDiv.style.height = height;
    newDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="cut-icon" onclick="removeImg(this)" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>`;

    const files = Array.from(e.files);
    files.forEach(file => {
        const imgDiv = document.createElement('div');
        imgDiv.classList = "image-display";

        const reader = new FileReader();

        // Read file as data URL
        reader.readAsDataURL(file);

        // Add an event listener for when file reading is complete
        reader.onload = function () {
            const img = document.createElement('img');
            img.src = reader.result;
            img.alt = file.name;
            img.classList.add('preview-image');
            imgDiv.appendChild(img);
        };

        newDiv.appendChild(imgDiv);
    })

    addImageLoc.before(newDiv)

    if (imgLen == 5) {
        addImageLoc.remove();
    } else {
        const inputFile = document.createElement('input')
        inputFile.type = 'file';
        inputFile.name = `${e.name}`;
        inputFile.classList = 'file-input-tag';
        inputFile.setAttribute('onchange', 'checkFile(this)');
        inputFile.accept = 'image/*';
        inputFile.multiple = true;
        addImageLoc.before(inputFile);
    }
}

const removeImg = e => {
    const imgCover = e.parentElement;
    const inputBtn = imgCover.previousElementSibling;
    const editLoc = imgCover.parentElement
    const inputName = inputBtn.name;
    imgCover.remove();
    inputBtn.remove();

    const color = inputName.slice(0, inputName.indexOf('-'));
    const inputBtnList = document.querySelectorAll(`input[name='${color}-image']`);
    let imgLen = 0;
    inputBtnList.forEach(btn => {
        imgLen += btn.files.length;
    })
    const addImageLoc = editLoc.querySelector('.add-option');
    if (imgLen < 5 && !addImageLoc) {
        const inputFile = document.createElement('input')
        inputFile.type = 'file';
        inputFile.name = `${inputName}`;
        inputFile.classList = 'file-input-tag';
        inputFile.setAttribute('onchange', 'checkFile(this)');
        inputFile.accept = 'image/*';
        inputFile.multiple = true;
        editLoc.appendChild(inputFile);

        const addImageBtn = document.createElement('div');
        addImageBtn.classList.add('add-option');
        addImageBtn.setAttribute('onclick', `takeInput('${color}')`);
        addImageBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
            </svg>`;
        editLoc.appendChild(addImageBtn);
    }
}

const nextSection = (e) => {
    const category = document.getElementById("category-input");
    const productType = document.getElementById("product-type-input");
    const brand = document.getElementById("brand-name-input");
    const radios = document.querySelectorAll('input[type="hidden"]');

    if (!category.value && category.value.length == 0) {
        alert(`Please select the category of your product. It's Important!`);
        return;
    }

    if (!productType.value && productType.value.length == 0) {
        alert(`Please select the category of your product. It's Important!`);
        return;
    }

    if (!brand.value && brand.value.length == 0) {
        alert(`Please select the brand of your product. It's Important!`);
        return;
    }

    let dataCheck = false;
    for(const radio of radios) {
        if (!radio.value && radio.value.length == 0) {
            alert(`Please select the ${radio.getAttribute('name')} of your product. It's Important!`);
            dataCheck = true;
            return;
        }
    }

    if (dataCheck) {
        return;
    }

    if (!form.reportValidity()) {
        return;
    }

    document.querySelector('#category-container').classList.add('stop-editing');

    const field = document.createElement("fieldset");
    let cls = [ "extra-questions","basic-container"];
    field.classList.add(...cls);
    field.innerHTML = "<legend>Product Details</legend>";
    document.querySelector('.section-1').appendChild(field);

    const quesListHint = productHintFinder(productType.value);
    const quesMarkList = subQueAns[quesListHint];

    quesMarkList.forEach(mark => {
        const newDiv = document.createElement("div");
        newDiv.classList.add("que-box");
        newDiv.innerHTML = queData[mark];
        field.appendChild(newDiv);
    })

    document.querySelector('.section-2').classList.add('section-2-on');
    e.parentElement.remove();
}



/* Submitting Form */
const form = document.getElementById('addProductForm');

form.addEventListener(
    "submit",
    () => {
        form.reportValidity();
    },
    false,
);

const submitDone = async () => {
    const category = document.getElementById("category-input");
    const product = document.getElementById("product-type-input");
    const brand = document.getElementById("brand-name-input");
    const radios = document.querySelectorAll('input[type="hidden"]');
    const checkboxes = document.querySelectorAll('.checkbox-options');

    if (!category.value && category.value.length == 0) {
        alert(`Please select the category of your product. It's Important!`);
        return;
    }

    if (!product.value && product.value.length == 0) {
        alert(`Please select the category of your product. It's Important!`);
        return;
    }

    if (!brand.value && brand.value.length == 0) {
        alert(`Please select the brand of your product. It's Important!`);
        return;
    }

    let dataCheck = false;
    for(const radio of radios)  {
        if (!radio.value && radio.value.length == 0) {
            alert(`Please select the ${radio.getAttribute('name')} of your product. It's Important!`);
            dataCheck = true;
            return;
        }
    }

    if (dataCheck) return;

    const colorSelected = document.querySelectorAll('input[name="color"]:checked')
    if (colorSelected.length == 0) {
        alert(`You doesn't have selected any color, please select at least any one.`)
        return;
    }

    checkboxes.forEach(check => {
        const checkList = check.querySelectorAll('input[type="checkbox"]:checked');
        if (checkList.length == 0) {
            alert(`You doesn't have selected any ${check.querySelector('input[type="checkbox"]').getAttribute('name')}, please select at least any one.`);
            dataCheck = true;
            return;
        }

    })

    if (dataCheck) return;


    colorSelected.forEach(color => {
        const fileInput = document.querySelectorAll(`input[name='${color.value}-image']`);
        let imgLen = 0;
        fileInput.forEach(input => {
            imgLen += input.files.length;
        })
        if (imgLen == 0) {
            alert(`Please add images for ${color.value} color.`)
            dataCheck = true;
        }
    })

    if (dataCheck) return;

    form.requestSubmit();

}





















// This Function was tried for saving form temporary for user so that everything will saved at each case but it got failed due to less knowledge of fetch 
// const saveData = () => {

//     // const colorSelected = document.querySelectorAll('input[name="color"]:checked')
//     // let colorArray = [];
//     // colorSelected.forEach(color => {
//     //     colorArray.push(color.value);
//     //     let imageArray = [];
//     //     const fileInput = document.querySelectorAll(`input[name='${color}-image']`);
//     //     fileInput.forEach(each => {
//     //         imageArray.push(each.files)
//     //     })
//     //     formData = Object.assign(formData,{[color+'-image']: imageArray});
//     // })

//     // const formDataObject = {
//     //     'product-category': document.getElementById('category-input').value,
//     //     'product-type': document.getElementById('product-type-input').value,
//     //     color: colorArray,
//     //     'model-name': document.getElementById('model-name').value,
//     //     'brand-name': document.getElementById('brand-name').value,
//     //     material: document.querySelector('input[name="material"]:checked')?document.querySelector('input[name="material"]:checked').value:null,
//     //     warranty: document.querySelector('input[name="warranty"]:checked')?document.querySelector('input[name="warranty"]:checked').value:null,
//     //     originalPrice: document.getElementById('price-value').value,
//     //     discount: document.getElementById('discount').value,
//     // };

//     // for (const key in formDataObject) {
//     //     if (formDataObject.hasOwnProperty(key)) {
//     //         formData = Object.assign(formData,{[key]: formDataObject[key]});
//     //     }
//     // }

//     let form = document.getElementById('addProductForm');

//     // Generate a unique boundary string
//     const boundary = '--------------------------' + Date.now().toString(16);

//     fetch('/user/add-product/basic-info-save', {
//         method: 'POST',
//         headers: {
//             // Specify the Content-Type header with the boundary string
//             'Content-Type': 'multipart/form-data; boundary=' + boundary
//         },
//         body: createFormData(form, boundary) // Create FormData object with the boundary string
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             // Handle successful response
//         })
//         .catch(error => {
//             // Handle errors
//             console.error('There was a problem uploading the files:', error);
//         });
// }

// // Function to create FormData object with the boundary string
// function createFormData(form, boundary) {
//     const formData = new FormData(form);
//     // Set the FormData's boundary property to the specified boundary string
//     formData.boundary = boundary;
//     return formData;
// }