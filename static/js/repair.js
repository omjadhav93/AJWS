document.querySelector('.problem').style.height = 'fit-content';

const done = (event) => {
    var mainDiv = event.parentElement.parentElement
    var ans = mainDiv.querySelector('input[type=radio]:checked').value
    if(ans){
        mainDiv.nextElementSibling.querySelector('#ans').textContent = ans
        mainDiv.nextElementSibling.style.display = 'flex'
        mainDiv.style.display = 'none'
        mainDiv.parentElement.nextElementSibling.style.height = 'fit-content';
    }
}

var cancle = document.getElementById('cancle')
cancle.addEventListener('click', () => {
    window.open('/', '_self')
})