// Hiding extra images
let imageSections = document.querySelectorAll('.search-image')
imageSections.forEach((item) => {
    let images = item.getElementsByClassName('images')
    for (let i = 1; i < images.length; i++) {
        images[i].classList.add('hide')
    }
})

// Converting rating from number to star
let rating = document.querySelectorAll('.rating')
rating.forEach(rate => {
    let count = Number(rate.textContent)
    rate.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        if(i<=count){
            let star = document.createElement('ion-icon');
            star.setAttribute('name','star')
            rate.appendChild(star)
            rate.append(" ")
        }else{
            let star = document.createElement('ion-icon');
            star.setAttribute('name','star-outline')
            rate.appendChild(star)
            rate.append(" ")
        }
        
    }
})


// Applying Filters
let searchItem = document.querySelectorAll('.search-item')
const applyFilter = () => {
    let brandName = document.querySelectorAll('input[name="brand"]:checked')
    let price = document.querySelectorAll('input[name="Price"]:checked')
    let material = document.querySelectorAll('input[name="material"]:checked')
    searchItem.forEach(item => {
        let check = true;
        if(brandName.length > 0){
            let subCheck = false;
            let brand = item.getElementsByClassName('brand')[0].getElementsByTagName('span')[0].textContent
            brandName.forEach(e => {
                if(brand.toUpperCase().indexOf(e.value.toUpperCase()) > -1) subCheck = true;
            })
            if(!subCheck){
                check = false;
            }
        }
        if(price.length > 0){
            let subCheck = false;
            let priceValue = Number(item.getElementsByClassName('price')[0].getElementsByTagName('span')[0].textContent)
            // priceValue = product price
            price.forEach(e => {
                let value = e.value
                let val1 = Number(value.substring(0,value.indexOf('t')))
                let val2 = Number(value.substring(value.indexOf('o')+1))
                if(priceValue >= val1*1000 && priceValue <= val2*1000) subCheck = true;
            })
            if(!subCheck){
                check = false;
            }
        }
        if(material.length > 0){
            let subCheck = false;
            let matter = item.getElementsByClassName('material')[0].textContent
            material.forEach(e => {
                if(e.value.toUpperCase().indexOf(matter.toUpperCase()) > -1) subCheck = true;
            })
            if(!subCheck){
                check = false;
            }
        }
        if(check){
            item.classList.remove('hideDiv')
        }else{
            item.classList.add('hideDiv')
        }
    })
}


// Functions

// Opening filter Option
const openFilter = () => {
    document.getElementById('filter-box').classList.toggle('active')
    document.getElementById('filter-box-background').classList.toggle('active')
}

// Opening product 
const openProduct = (e) => {
    const modelNo = e.getElementsByClassName('model-number')[0].textContent
    window.location.href = `/user/product?modelNo=${modelNo}`
}