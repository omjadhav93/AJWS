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



window.onload = () => {
    if (screen.width <= 860) {
        // Moving Cart btn
        const cartMove = document.getElementById('cart')
        document.getElementsByClassName('right-nav')[0].appendChild(cartMove)

        // Moving search Bar
        const searchMove = document.getElementsByClassName('search-box')[0]
        document.getElementsByClassName('right-nav')[0].appendChild(searchMove)

        // Removing repair btn
        document.getElementById('repair-request').remove()

        // Inserting menu btn
        const menuDiv = document.createElement('div')
        menuDiv.classList = "menu-box";
        menuDiv.id = "menu-box"
        menuDiv.innerHTML = `<button id="menu-btn" onclick="openMenu()"> 
          <ion-icon name="menu" id="menu-icon"></ion-icon>
        </button>`;
        document.getElementsByClassName('left-nav')[0].classList.add('short')
        document.getElementsByClassName('left-nav')[0].prepend(menuDiv)
    }

    const repairAnimate = setInterval(() => {
        document.getElementsByClassName('repair-btn')[0].classList.toggle('animate')
    }, 3000);

    setTimeout(() => {
        clearInterval(repairAnimate);
    }, 30000);
}

