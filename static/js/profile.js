const sectionList = document.querySelectorAll('.profile-content > div');
sectionList.forEach( (section,i) => {
    section.style.transform = `translateY(${i*100}%)`;
})

const changeMenu = (e) => {
    const menuOps = document.querySelectorAll('.profile-menu-item');
    let menuIndex = 0;
    menuOps.forEach((menu,i) => {
        if (menu.classList.contains('highlight')) {
            menu.classList.remove('highlight')
        }
        if (menu == e) {
            e.classList.add('highlight')
            menuIndex = i;
        }
    })
    sectionList.forEach( (section,i) => {
        section.style.transform = `translateY(${(i-menuIndex)*100}%)`;
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
            <button type="button" class="save-btn" > Save </button>`;
    }else if(cls == 'email-info'){
        changeOpt.innerHTML = `
            <div class="input"> 
              <input class="input-element" type="email" name="email" id="email" required="required"/>
              <label class="input-label" for="email">Email Address</label>
            </div>
            <button type="button" class="save-btn" > Save </button>`;
    }else if(cls == 'phone-number'){
        changeOpt.innerHTML = `
            <div class="input"> 
              <input class="input-element" type="number" name="phone" id="phone" required="required"/>
              <label class="input-label" for="phone">Phone Number</label>
            </div>
            <button type="button" class="save-btn" > Save </button>`;
    }

    setHead.querySelector('.setting-edit').removeAttribute('onclick')

    section.innerHTML = '';
    section.appendChild(setHead);
    section.appendChild(changeOpt);

    if(cls == 'personal-info'){
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