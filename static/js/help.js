const markReviewed = (id) => {
    if (window.confirm('Are you sure you want to mark this request reviewed.')) {
        const form = document.createElement('form');
        form.action = '/help/reviewed';
        form.method = 'POST';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.value = id;
        idInput.name = 'Id';

        form.appendChild(idInput);

        document.body.appendChild(form);

        form.submit();
    }
}

const msgBox = document.querySelector('.msg');

if(msgBox){
    setTimeout(() => {
        msgBox.style.transform = 'translateX(-50%) scale(1)';
        const endMsg = setTimeout(() => {
            msgBox.style.transform = 'translateX(-50%) scale(0)';
        }, 10000)
        window.addEventListener("click", (e) => {
            if(!msgBox.contains(e.target)){
                msgBox.style.transform = 'translateX(-50%) scale(0)';
                clearTimeout(endMsg);
            }
        })
    }, 1000)
}

document.getElementById('problemType').addEventListener('change', function () {
    const orderNumberDiv = document.getElementById('orderNumberDiv');
    if (this.value === 'order') {
        orderNumberDiv.style.display = 'block';
        document.getElementById('orderNumber').setAttribute('required', 'required');
    } else {
        orderNumberDiv.style.display = 'none';
        document.getElementById('orderNumber').removeAttribute('required');
    }
});

window.onload = () => {
    // Clear query parameters from the URL
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
}