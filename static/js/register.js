const changeView = (e) => {
    const input = e.parentElement;
    const passwordInput = input.querySelector('.input-element');
    e.innerHTML = passwordInput.type === 'password' ? '<ion-icon name="eye-off-outline"></ion-icon>' : '<ion-icon name="eye-outline"></ion-icon>';
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

const otpSubmition = () => {
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
                    const response = await fetch('/login/validate-otp', {
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
                        window.location.href = data.returnTo || '/';
                    }
                } catch (error) {
                    document.getElementById('error-message').textContent = "Something went wrong. Try again.";
                    otpSubmition();
                }
            });
        }
    }, 1); // Check every 1ms
}

const otpForm = (msg, email) => {
    const url = new URL(location);
    window.history.pushState({}, "", url);

    const formSpace = document.getElementById('right');
    formSpace.innerHTML = `
        <p class="res-msg">${msg}</p>
        <div class="otp-container">
            <h2>Enter OTP</h2>
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
                <button type="submit">Verify</button>
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

    otpSubmition();

};

const otpGeneration = async (type) => {
    const email = document.getElementById('email').value;

    await fetch(`/${type}/generate-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'email': email
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                otpForm(data.msg, email);
            } else {
                alert(data.msg);
            }
        })
        .catch(error => alert(`Error: ${error}`));
}