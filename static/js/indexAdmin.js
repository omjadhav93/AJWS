// edit cards
const cardEdit = (e,cardNo) => {
    let toEdit = e.target.parentElement
    let title = toEdit.querySelector('.selling-card-heading').innerHTML
    let imgSrc = toEdit.querySelector('img').getAttribute('src')
    let note = toEdit.querySelector('.selling-card-note').innerHTML

    let editSection = document.querySelector('.edit-background')
    editSection.style.transform = 'scale(1)'

    editSection.querySelector('.selling-card').innerHTML = `
            <form action="/saveCard" method="post" enctype="multipart/form-data" class="editing-selling-card">
                <input type="hidden" name="cardNo" value="${cardNo}" />
                <input type="text" name="title" class="selling-card-heading-edit" value="${title}" spellcheck="false" maxlength="20" />
                <div class="selling-card-img">
                    <div class="change-op">
                        <button type="button" class="change-btn" onclick="inputImage(event)">Change Image</button>
                        <input type="file" name="cardImage" class="inputImage" accept="image/*" onchange="imagePreview(event)"/>
                    </div>
                    <img src="${imgSrc}"
                        alt="">
                </div>
                <textarea name="desc" class="selling-card-note-edit" spellcheck="false" maxlength="45"
                rows="2">${note}</textarea>
                <input type="text" name="modelNo" class="selling-card-heading-edit" spellcheck="false" maxlength="20" placeholder="Model Number" />
                <button type="submit" class="submit-btn btn" onclick="window.confirm('Do you want to submit the form?')">Submit</button>
            </form>
            `
    editSection.setAttribute('onclick', 'checkOrClose(event)')

}

// Close edit section
const checkOrClose = (e) => {
    let target = e.target
    let editSection = document.querySelector('.edit-background')
    if (target === editSection) {
        editSection.style.transform = 'scale(0)'
        editSection.removeAttribute('onclick')
    }
}

// Input image option creation
const inputImage = (e) => {
    e.target.nextElementSibling.click();
}

// Input image validation
function validateFileType(e) {
    let inputImage = e.target.value;
    var idxDot = inputImage.lastIndexOf(".") + 1;
    var extFile = inputImage.substr(idxDot, inputImage.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
    } else {
        alert("Only jpg/jpeg and png files are allowed!");
    }
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


