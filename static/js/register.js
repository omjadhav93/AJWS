const changeView = (e) => {
    const input = e.parentElement;
    const passwordInput = input.querySelector('.input-element');
    e.innerHTML = passwordInput.type === 'password' ? '<ion-icon name="eye-off-outline"></ion-icon>' : '<ion-icon name="eye-outline"></ion-icon>';
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
