const Verify = () => {
    const password = document.getElementById('password').value 
    const confirmPassword = document.getElementById('confirmPassword').value
    if(password != confirmPassword){
        alert("Passwords doesn't match")
        return;
    }
    if(password.length < 6){
        alert("Password should contain atleast 6 characters")
        return;
    }
    const securityQuestion = document.getElementById('security-question').value
    if(securityQuestion == ""){
        alert("Please select a security question")
        return;
    }
    const securityAns = document.getElementById('security-ans').value
    if(securityAns == "" || securityAns == " "){
        alert("Please write an answer for the security question")
        return;
    }
    document.getElementById('registerForm').submit();
}