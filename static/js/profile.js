const changeMenu = (e) => {
    console.log(e)
    const menuOps = document.querySelectorAll('.profile-menu-item');
    menuOps.forEach(menu => {
        if(menu.classList.contains('highlight')){
            console.log(menu)
            menu.classList.remove('highlight')
        }
        if(menu == e){
            e.classList.add('highlight')
        }
    })
}