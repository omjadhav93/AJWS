// Designing part
let imageLocater = document.getElementsByClassName("image-data");
for (let i = 1; i < imageLocater.length; i++) {
  imageLocater[i].classList.add("hideImage");
}
let imagePreview = document.getElementsByClassName("image-preview");
for (let i = 0; i < imagePreview.length; i++) {
  if (i > 0) {
    imagePreview[i].classList.add("hideImage");
  }
  let images = imagePreview[i].querySelectorAll(".images");
  images.forEach((image, index) => {
    image.style.left = `${100 * index}%`;
  });
}

//specs hide
var specs = document.querySelectorAll('.spec')
specs.forEach((item) => {
  if (!(item.lastElementChild.innerHTML) || item.lastElementChild.innerHTML == " ") {
    item.style.display = 'none'
  }
})

// Image Slider
const slider = (c, i) => { // c = index of color for which slide changing asked , i = image index
  let images = imagePreview[c].querySelectorAll(".images");
  images.forEach(img => {
    img.style.transform = `translateX(-${100 * i}%)`
  })
}

// Color changer
const changeColor = (color, j) => {
  // image changing
  for (let i = 0; i < imagePreview.length; i++) {
    if (i == j) {
      imagePreview[i].classList.remove("hideImage");
    }
    else {
      imagePreview[i].classList.add("hideImage");
    }
  }

  // Image Locator changing
  for (let i = 0; i < imageLocater.length; i++) {
    if (i == j) {
      imageLocater[i].classList.remove("hideImage");
    }
    else {
      imageLocater[i].classList.add("hideImage");
    }
  }

  // color names & option change
  let colors = document.getElementsByClassName('color-box')
  for (let i = 0; i < colors.length; i++) {
    if (i == j) {
      colors[i].classList.add("now");
    }
    else {
      colors[i].classList.remove("now");
    }
  }
  document.getElementById('currentColor').innerHTML = `${color}`;
  document.getElementById('color').innerHTML = `${color}`;
  document.getElementById('colorInForm').value = `${color}`;
}

// Touchscroll for images
var touchsurface = document.getElementById('top-part'),
  startX,
  startY,
  startPlace,
  dist,
  threshold = 50, //required min distance traveled to be considered swipe
  allowedTime = 1000, // maximum time allowed to travel that distance
  elapsedTime,
  startTime

function swipeHead(isrightswipe, direction) {
  if (isrightswipe) {
    let c;
    let j;
    let end = false;
    let imagePreview = document.getElementsByClassName("image-preview");
    for (let i = 0; i < imagePreview.length; i++) {
      let images = imagePreview[i].querySelectorAll(".images");
      images.forEach((image, index) => {
        let imgTag = image.querySelector('img')
        if (startPlace == image || startPlace == imgTag) {
          c = i;
          j = index;
          if (index == images.length - 1 && direction < 0) {
            end = true;
          }
          if (index == 0 && direction > 0) {
            end = true;
          }
        }
      });
    }

    if (end) {
      return;
    }

    if (direction < 0) {
      slider(c, ++j);
    } else if (direction > 0) {
      slider(c, --j);
    }
  }
}

touchsurface.addEventListener('touchstart', function (e) {
  var touchobj = e.changedTouches[0]
  startPlace = e.target
  dist = 0
  startX = touchobj.pageX
  startY = touchobj.pageY
  startTime = new Date().getTime() // record time when finger first makes contact with surface
})

touchsurface.addEventListener('touchmove', function (e) {
  // prevent scrolling when inside DIV
})

touchsurface.addEventListener('touchend', function (e) {
  var touchobj = e.changedTouches[0]
  dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
  elapsedTime = new Date().getTime() - startTime // get time elapsed
  // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
  var swiperightBol = (elapsedTime <= allowedTime && (Math.abs(dist) >= threshold) && Math.abs(touchobj.pageY - startY) <= 200)
  if (swiperightBol) {
    swipeHead(swiperightBol, dist)
    e.preventDefault()
  }
})

// Like Product
const addLike = () => {
  const modelNo = document.getElementById('model-number').textContent.trim();

  fetch('/api/addFav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelNo: modelNo })
  })
    .then(response => response.json())
    .then(stats => {
      if (stats.msg == "Unsigned") {
        alert("You need to login to save the product in your Favourites list.");
      } else if (stats.msg == "Success") {
        const likeBtn = document.getElementById('like-btn');
        likeBtn.setAttribute('onclick', 'removeLike()')
        likeBtn.style.color = 'red';
        likeBtn.innerHTML = '<ion-icon name="heart"></ion-icon>';
      } else {
        alert("Something went wrong while saving the product to your Favourite list.");
      }
    })
    .catch(error => console.error('Error adding favourite:', error));
}

const removeLike = () => {
  const modelNo = document.getElementById('model-number').textContent.trim();

  fetch('/api/removeFav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelNo: modelNo })
  })
    .then(response => response.json())
    .then(stats => {
      if (stats.msg == "Success") {
        const likeBtn = document.getElementById('like-btn');
        likeBtn.setAttribute('onclick', 'addLike()')
        likeBtn.style.color = 'black';
        likeBtn.innerHTML = '<ion-icon name="heart-outline"></ion-icon>';
      } else {
        alert("Something went wrong while removing the product from your Favourite list.");
      }
    })
    .catch(error => console.error('Error adding favourite:', error));
}

/* Loading Animation Ends */
document.getElementById('loading').style.display = 'none';
document.body.style.overflowY = 'auto';