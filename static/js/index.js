
// Number runner
const runnerFunction = () => {
    let achievements = document.querySelectorAll('.achieve-num')
    let achieveTarget = [];
    let greaterIndex = -1;
    achievements.forEach((num) => {
        greaterIndex = Math.max(greaterIndex, Number(num.textContent));
        achieveTarget.push(Number(num.textContent))
        num.innerHTML = 0;
    })
    let check = false;
    let numRunner = setInterval(() => {
        achievements.forEach((num, i) => {
            let currVal = Number(num.textContent) + 1;
            if (achieveTarget[i] > 50000) {
                currVal += 999
            } else if (achieveTarget[i] > 500) {
                currVal += 99
            }
            if (currVal <= achieveTarget[i]) {
                num.innerHTML = currVal;
            } else if (greaterIndex == i) {
                check = true;
            }
        })
        if (check) clearInterval(numRunner);
    }, 30)
}

const observer = new IntersectionObserver(el => {
    if (el[0].isIntersecting) {
        runnerFunction();
    }
})

const achieveList = document.getElementById('achieve-list')
observer.observe(achieveList)


// Fetching products
// Function to fetch products from the server
function fetchProducts(sectionId) {
    fetch(`/api/${sectionId}`)
        .then(response => response.json())
        .then(data => {
            const productsDiv = document.getElementById(`${sectionId}`);
            productsDiv.innerHTML = ''; // Clear existing content
            if(Object.hasOwn(data, 'msg')){
                productsDiv.innerHTML = `<center>${data.msg}</center>`;
                return;
            }
            data.forEach(product => {
                const imageDiv = document.createElement('img');
                imageDiv.classList.add('product-img');
                imageDiv.src = `/static/productImg/${product.image}`;
                const productElement = document.createElement('div');
                productElement.classList.add('product-box');
                productElement.setAttribute('onclick',`window.location.href= '/product?modelNo=${product['model-number']}'`)
                productElement.appendChild(imageDiv);
                productsDiv.appendChild(productElement);
            });
        })
        .catch(error => alert(`Error fetching products: ${error}`));
}

// Function to initialize Intersection Observer
function initObserver() {
    const frequentProducts = document.getElementById('frequent');
    const topDesign = document.getElementById('topDesign');
    const lessPrice = document.getElementById('lessPrice');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                fetchProducts(sectionId);
                observer.unobserve(entry.target); // Fetch products only once
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(frequentProducts);
    observer.observe(topDesign);
    observer.observe(lessPrice);
}

// Fetch Brands
function fetchBrand() {
    fetch(`/api/brands`)
        .then(response => response.json())
        .then(data => {
            const brandsDiv = document.getElementById('brands');
            brandsDiv.innerHTML = '';
            if(Object.hasOwn(data, 'msg')){
                brandsDiv.innerHTML = `<center>${data.msg}</center>`;
                return;
            }
            data.forEach(brand => {
                const imageDiv = document.createElement('img');
                imageDiv.classList.add('product-img');
                imageDiv.src = `/${brand.logoUrl}`;
                imageDiv.setAttribute('onclick',`window.location.href= "/search?value=${brand.name}"`)
                const brandElement = document.createElement('div');
                brandElement.classList.add('brand');
                brandElement.appendChild(imageDiv);
                brandsDiv.appendChild(brandElement);
            });
        })
}
function initiateBrandObs() {
    const brandsDiv = document.getElementById('brands');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchBrand();
                observer.unobserve(entry.target); // Fetch products only once
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(brandsDiv)
}

// Initialize the observer when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initObserver();
    initiateBrandObs();
});