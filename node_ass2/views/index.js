var usernameInputBox=document.getElementById("username-input-box");
var emailInputBox=document.getElementById("Email-input-box");
var passwordInputBox=document.getElementById("password-input-box");
var confirmInputBox=document.getElementById("repassword-input-box");



$('#sub-btn').click(function(){
    if(usernameInputBox.value ==""){
        return alert("User Name Required");
    }
    if(emailInputBox.value ==""){
        return alert("Email Required");
    }
    if(passwordInputBox.value=="" ){
        return alert("Password Required");
    }
    if(confirmInputBox.value ==""){
        return alert("Confirm Password Required");
    }
        if(passwordInputBox.value.trim()!==confirmInputBox.value.trim()){
            return alert("password and confirm password should be same")
        }
        const obj={
            "UserName":usernameInputBox.value.trim(),
            "Email":emailInputBox.value.trim(),
            "Password":passwordInputBox.value.trim(),
            "ConfirmPassword":confirmInputBox.value.trim()
        }
        axios({
            method:'POST',
            url:'http://localhost:8080/signup',
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.message==="user registered successfully"){
                usernameInputBox.value="";
                emailInputBox.value="";
                passwordInputBox.value="";
                confirmInputBox.value="";
                return alert(response.data.message + " Check your mail for conformation");
            }else{
                usernameInputBox.value="";
                emailInputBox.value="";
                passwordInputBox.value="";
                confirmInputBox.value="";
                return alert(response.data.message)
            }
        }).catch(err=>{console.log(err)})
    
})

$('#can-btn').click(function(){
    usernameInputBox.value="";
    emailInputBox.value="";
    passwordInputBox.value="";
    confirmInputBox.value="";
})