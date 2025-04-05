const changeView = (e) => {
    const input = e.parentElement;
    const passwordInput = input.querySelector('.input-element');
    e.innerHTML = passwordInput.type === 'password' ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
        </svg>` 
        : 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </svg>`;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

const otpSubmition = (type) => {
    const interval = setInterval(() => {
        const otpFormElement = document.getElementById('otp-form');
        if (otpFormElement) {
            clearInterval(interval); // Stop checking once the form is found

            otpFormElement.addEventListener('submit', async function (e) {
                e.preventDefault();
                const inputs = document.querySelectorAll('.otp-inputs input');
                const otp = Array.from(inputs).map(input => input.value).join('');
                const email = document.getElementById('email').value;

                if (otp.length !== 6) {
                    document.getElementById('error-message').textContent = "Enter a 6-digit OTP";
                    return;
                }

                try {
                    const response = await fetch(`/${type}/validate-otp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, otp })
                    });

                    const data = await response.json();
                    if (!data.success) {
                        document.getElementById('error-message').textContent = data.msg;
                        otpSubmition();
                    } else {
                        window.open(data.returnTo || '/');
                    }
                } catch (error) {
                    document.getElementById('error-message').textContent = "Something went wrong. Try again.";
                    otpSubmition();
                }
            });
        }
    }, 1); // Check every 1ms
}

const otpForm = (email, type) => {
    const url = new URL(location);
    window.history.pushState({}, "", url);

    const formSpace = document.getElementById('form-section');
    formSpace.innerHTML = `
        <div class="otp-container">
            <p class="res-msg">Please enter OTP sent to email</p>
            <p class="res-msg">${email}</p>
            <form action="" id="otp-form">
                <input type="hidden" id="email" name="email" value="${email}">
                <div class="otp-inputs">
                    <input type="text" maxlength="1" required>
                    <input type="text" maxlength="1" required>
                    <input type="text" maxlength="1" required>
                    <input type="text" maxlength="1" required>
                    <input type="text" maxlength="1" required>
                    <input type="text" maxlength="1" required>
                </div>
                <button type="submit" class="btn verify-btn">Verify</button>
                <p class="error-msg" id="error-message"></p>
            </form>
        </div>
    `;

    const inputs = document.querySelectorAll('.otp-inputs input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    otpSubmition(type);

};

const otpGeneration = async (type) => {
    // Define required fields for each type
    const formFields = {
        login: ['email'],
        register: ['first-name', 'last-name', 'email', 'phone', 'password', 'confirm'],
        forgot: ['email']
    };

    let formData = {};
    let isValid = true;
    let firstInvalidField = null;

    // Remove existing warnings
    document.querySelectorAll('.warn').forEach(warn => warn.remove());

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Ensures 10-digit phone number
    const passwordRegex = /^.{6,}$/; // At least 6 characters

    // Validate each required field
    formFields[type].forEach(field => {
        let input = document.getElementById(field);
        const value = input?.value.trim() || '';
        let warnMessage = '';

        if (!value) {
            warnMessage = `${field.replace('-', ' ')} is required.`;
        } else if (field === 'email' && !emailRegex.test(value)) {
            warnMessage = 'Please enter a valid email address.';
        } else if (field === 'phone' && !phoneRegex.test(value)) {
            warnMessage = 'Phone number must be 10 digits.';
        } else if ((field === 'password' || field === 'confirm') && !passwordRegex.test(value)) {
            warnMessage = 'Password must be at least 6 characters.';
        } else if (field === 'confirm' && value !== document.getElementById('password').value) {
            warnMessage = 'Passwords do not match.';
        }

        if (field == 'first-name' || field == 'last-name') {
            input = input.parentElement;
        }

        if (warnMessage) {
            const warnDiv = document.createElement('div');
            warnDiv.className = 'warn';
            warnDiv.textContent = warnMessage;
            input.parentElement.insertAdjacentElement('afterend', warnDiv);

            if (!firstInvalidField) {
                firstInvalidField = input;
            }
            isValid = false;
        }

        formData[field] = value;
    });

    if (!isValid) {
        firstInvalidField?.focus();
        return;
    }

    // Send request
    await fetch(`/${type}/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                otpForm(formData.email, type);
            } else {
                if (data.msg.path) {
                    document.querySelectorAll('.warn').forEach(warn => warn.remove());
                    const input = document.getElementById(data.msg.path)
                    const warnDiv = document.createElement('div');
                    warnDiv.className = 'warn';
                    warnDiv.textContent = data.msg.msg;
                    input.parentElement.insertAdjacentElement('afterend', warnDiv);
                } else {
                    document.querySelectorAll('.warning').forEach(warn => warn.remove());
                    const form = document.getElementById('auth-form');
                    const warnDiv = document.createElement('div');
                    warnDiv.className = 'warning';
                    warnDiv.textContent = data.msg || 'Something went wrong.'
                    form.insertAdjacentElement('afterbegin', warnDiv);
                }
            }
        })
        .catch(error => alert(`Error: ${error}`));
};

/* Loading Animation Ends */
document.getElementById('loading').style.display = 'none';
document.body.style.overflowY = 'auto';
