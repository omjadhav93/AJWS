const changeView = (e) => {
    const input = e.parentElement;
    const passwordInput = input.querySelector('.input-element');
    e.innerHTML = passwordInput.type === 'password' ? '<ion-icon name="eye-off-outline"></ion-icon>' : '<ion-icon name="eye-outline"></ion-icon>';
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}