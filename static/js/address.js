const addAddress = () => {
  document.getElementsByClassName("content")[0].innerHTML = `<form action="/user/address" method="post" id="contactForm"> 
    <div class="heading">Address</div>
    <div class="input">
      <input class="input-element" type="text" name="address-1" id="address-1" required="required" value=""/>
      <label class="input-label" for="address-1">Address Line 1</label>
    </div>
    <div class="input">
      <input class="input-element" type="text" name="address-2" id="address-2"/>
      <label class="input-label" for="address-2">Address Line 2 (Optional)</label>
    </div>
    <div class="input-split">
      <button class="selectOptBtn" id=" type="button" onclick="openOption(this)">
        <div class="selected" id="selected">Select State</div><ion-icon name="arrow-forward-outline"></ion-icon>
        <div class="selectOptContainer addOption" id="selectOptContainer">
          <span class="opt" onclick="select(this)" value="">Select State</span>
          <span class="opt" onclick="select(this)" value="Maharastra">Maharastra</span>
        </div>
      </button>
      <input id="selectedOption" type="hidden" name="state" required="required"/>
      <button class="selectOptBtn" type="button" onclick="openOption(this)">
        <div class="selected" id="selected">Select District</div><ion-icon name="arrow-forward-outline"></ion-icon>
        <div class="selectOptContainer addOption" id="selectOptContainer">
          <span class="opt" onclick="select(this)" value="">Select District</span>
          <span class="opt" onclick="select(this)" value="Ahmednagar">Ahmednagar</span>
          <span class="opt" onclick="select(this)" value="Aurangabad">Sambhajinagar</span>
          <span class="opt" onclick="select(this)" value="Mumbai">Mumbai</span>
          <span class="opt" onclick="select(this)" value="Pune">Pune</span>
          <span class="opt" onclick="select(this)" value="Thane">Thane</span>
        </div>
      </button>
      <input id="selectedOption" type="hidden" name="district" required="required"/>
    </div>
    <div class="input">
      <input class="input-element" type="number" name="pincode" id="pincode" required="required" value=""/>
      <label class="input-label" for="pincode">Pin-Code</label>
    </div>
    <button class="btn" type="button" style="margin-top: 25px;" onclick="submitDone()">Submit</button>
  </form>`;
  styleElements();
}


const styleElements = () => {
  // Get all input elements
  const inputs = document.querySelectorAll('.input-element');
  
  // Get all elements with the same class
  const selectOptContainer = document.querySelectorAll('.selectOptContainer');
  
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

  // Get the maximum width among all elements
  selectOptContainer.forEach(option => {
    const elements = option.querySelectorAll('.opt')

    let maxWidth = 0;
    elements.forEach(element => {
      const width = element.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });
    // Set the width of all elements to the maximum width
    elements.forEach((element, i) => {
      element.style.width = maxWidth + 'px';
      if (i == 0) {
        element.style.border = 'none';
      }
    });

  })
}

const isInputOnScreen = document.querySelectorAll('.input-element').length;

if(isInputOnScreen){
  styleElements();
}

const openOption = (btn) => {
  btn.querySelector("#selectOptContainer").classList.toggle("addOption")
}

const select = (e) => {
  let text = e.innerText;
  let value = e.getAttribute('value');
  let target = e.parentElement.parentElement;
  target.querySelector('#selected').innerText = text;
  target.nextElementSibling.value = value;
}

window.addEventListener('click', function (e) {
  const selectBtns = document.querySelectorAll('.selectOptBtn');
  selectBtns.forEach(btn => {
    if (!btn.contains(e.target) && !btn.querySelector("#selectOptContainer").classList.contains("addOption")) {
      openOption(btn);
    }
  })
});

// Submit Form
const submitDone = async () => {
  /* Submitting Form */
  const form = document.getElementById('contactForm');

  form.addEventListener(
    "submit",
    () => {
      form.reportValidity();
    },
    false,
  );

  const selects = document.querySelectorAll('input[type="hidden"]');
  let selectCheck = false;
  selects.forEach(select => {
    if (!select.value && select.value.length == 0) {
      alert(`Please select your ${select.getAttribute('name').toUpperCase()} .`);
      selectCheck = true;
      return;
    }
  })

  if (selectCheck) return;

  form.requestSubmit();
}