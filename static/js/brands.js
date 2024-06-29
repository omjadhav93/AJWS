const addBrandForm = (edit) => {
    const confBkg = document.createElement('div')
    confBkg.classList.add('form-background');
    const nav2 = document.querySelector('navbar').offsetHeight;
    const screen = window.innerHeight;
    confBkg.style.height = `${screen - nav2}px`;
    confBkg.style.top = `${nav2}px`;

    const confDiv = document.createElement('div');
    confDiv.classList.add('form-container');

    const confHeadDiv = document.createElement('div');
    confHeadDiv.classList.add('form-head-box');
    if (edit) {
        confHeadDiv.innerHTML = `
            <p class="form-heading" >Edit Brand Details</p>
            <ion-icon name="close" onclick="document.getElementById('content').click()"></ion-icon>`
    } else {
        confHeadDiv.innerHTML = `
            <p class="form-heading" >Add a Brand</p>
            <ion-icon name="close" onclick="document.getElementById('content').click()"></ion-icon>`
    }
    confDiv.appendChild(confHeadDiv);

    const confBtmDiv = document.createElement('div');
    confBtmDiv.classList.add('form-bottom-box');

    if (edit) {
        let toEdit = edit.target.parentElement;
        let imgSrc = toEdit.querySelector('img').getAttribute('src');
        let name = toEdit.querySelector('.brand-name').textContent.trim();
        let desc = toEdit.querySelector('.brand-description').textContent.trim();
        let origin = toEdit.querySelector('.brand-origin').textContent.split(':')[1].trim();
        let categories = toEdit.querySelector('.brand-categories').textContent.split(':')[1].trim();


        confBtmDiv.innerHTML = `
        <form action="/brands" method="POST" enctype="multipart/form-data">
            <div class="brand-logo-form">
                <div class="change-op">
                    <button type="button" class="change-btn" onclick="inputImage(event)">Change Image</button>
                    <input type="file" name="logo" class="inputImage" accept="image/*" onchange="imagePreview(event)"/>
                </div>
                <img src="${imgSrc}" alt="">
            </div>
            <div class="input">
                <input type="text" class="input-element" id="name" name="name" value="${name}" required>
                <label class="input-label" for="name">Name</label>
            </div>
            <div class="input">
                <label class="desc-label" for="myTextarea">Description</label>
                <textarea class="desc-input" rows="4" maxlength="350" id="myTextarea" name="description" required>${desc}</textarea>
            </div>
            <div class="input">
                <input type="text" class="input-element" id="origin" name="origin"  value="${origin}" required>
                <label class="input-label" for="origin">Country Of Origin</label>
            </div>
            <div class="input">
                <input type="text" class="input-element" id="categories" name="categories"  value="${categories}" required>
                <label class="input-label" for="categories">Categories (comma separated):</label>
            </div>
            <div class="brand-submit">
                <button type="submit" class="brand-submit-btn">Add Brand</button>
            </div>
        </form>`;

        fetch(imgSrc)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], "example.jpg", { type: blob.type });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                document.querySelector('.inputImage').files = dataTransfer.files;
            })
            .catch(error => console.error('Error:', error));
    } else {
        confBtmDiv.innerHTML = `
        <form action="/brands" method="POST" enctype="multipart/form-data">
            <div class="brand-logo-form">
                <div class="change-op">
                    <button type="button" class="change-btn" onclick="inputImage(event)">Add Image</button>
                    <input type="file" name="logo" class="inputImage" accept="image/*" onchange="imagePreview(event)" required/>
                </div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8icoX8FDqZA-XQ_zf0W3j2rVfSn_tCBghfA&s" alt="">
            </div>
            <div class="input">
                <input type="text" class="input-element" id="name" name="name" required>
                <label class="input-label" for="name">Name</label>
            </div>
            <div class="input">
                <label class="desc-label" for="myTextarea">Description</label>
                <textarea class="desc-input" rows="4" maxlength="350" id="myTextarea" name="description" required></textarea>
            </div>
            <div class="input">
                <input type="text" class="input-element" id="origin" name="origin"  required>
                <label class="input-label" for="origin">Country Of Origin</label>
            </div>
            <div class="input">
                <input type="text" class="input-element" id="categories" name="categories"  required>
                <label class="input-label" for="categories">Categories (comma separated):</label>
            </div>
            <div class="brand-submit">
                <button type="submit" class="brand-submit-btn">Add Brand</button>
            </div>
        </form>`;
    }

    confDiv.appendChild(confBtmDiv);
    confBkg.appendChild(confDiv);

    window.addEventListener('click', closeConfirm, true);

    document.body.classList.add('no-scroll');
    document.getElementById('content').appendChild(confBkg);

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

const closeConfirm = (e) => {
    const clickArea = document.querySelector('#content');
    const nonClickArea = document.querySelector('.form-container');
    if (clickArea.contains(e.target) && !nonClickArea.contains(e.target)) {
        window.removeEventListener('click', closeConfirm, true);
        document.querySelector('.form-background').remove();
        document.body.classList.remove('no-scroll');
    }
}

// Input image option creation
const inputImage = (e) => {
    e.target.nextElementSibling.click();
}

// Input Image Preview
function readURL(input, preview) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            preview.setAttribute('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function imagePreview(e) {
    let inputTag = e.target
    let imgToChange = inputTag.parentElement.nextElementSibling
    readURL(inputTag, imgToChange)
}

const deleteBrand = (id) => {

    if (window.confirm('Are you sure you want to delete the Brand.')) {
        const form = document.createElement('form');
        form.action = '/brands/delete';
        form.method = 'POST';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.value = id;
        idInput.name = 'brandId';

        form.appendChild(idInput);

        document.body.appendChild(form);

        form.submit();
    }
}