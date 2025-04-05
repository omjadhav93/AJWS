// Call Search 
document.getElementById('search').addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let toSearch = document.getElementById('search').value
        window.location.href = `/search?value=${toSearch}`
    }
})

// Menu Button Work
const openMenu = () => {
    document.getElementsByTagName('navbar')[0].classList.toggle('active')
}

function checkScreenSize() {
    const isSmallScreen = window.innerWidth <= 860;
    const mainNav = document.getElementsByClassName('main-nav')[0];
    const rightNav = document.getElementsByClassName('right-nav')[0];
    const leftNav = document.getElementsByClassName('left-nav')[0];

    const cart = document.getElementById('cart');
    const searchBox = document.getElementsByClassName('search-box')[0];
    const repairBtn = document.getElementById('repair-request');
    const existingMenu = document.getElementById('menu-box');

    if (isSmallScreen) {
        if (!rightNav.contains(cart)) rightNav.appendChild(cart);
        if (!rightNav.contains(searchBox)) rightNav.appendChild(searchBox);

        if (repairBtn) repairBtn.style.display = "none";

        if (!existingMenu) {
            const menuDiv = document.createElement('div');
            menuDiv.classList = "menu-box";
            menuDiv.id = "menu-box";
            menuDiv.innerHTML = `
                <button id="menu-btn" onclick="openMenu()"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
                </button>
            `;
            leftNav.classList.add('short');
            leftNav.prepend(menuDiv);
        }
    } else {
        const profileRef = mainNav.querySelector('#profileRef');
        if (!mainNav.contains(searchBox)) mainNav.insertBefore(searchBox, profileRef);
        if (!mainNav.contains(cart)) mainNav.insertBefore(cart, profileRef);

        if (repairBtn) repairBtn.style.display = "flex";

        if (existingMenu) existingMenu.remove();
        leftNav.classList.remove('short');
    }
}

// Listen for screen changes
window.addEventListener('load', checkScreenSize);
window.addEventListener('resize', checkScreenSize);

window.onload = () => {

    const repairAnimate = setInterval(() => {
        document.getElementsByClassName('repair-btn')[0].classList.toggle('animate')
    }, 3000);

    setTimeout(() => {
        clearInterval(repairAnimate);
    }, 30000);
}

