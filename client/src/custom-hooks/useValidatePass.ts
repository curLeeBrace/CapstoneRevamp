


const useValidatePass = (password : string, re_typePass : string) : boolean => {

    let isValid = false;
    const acceptable_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=]).{8,}$/;

    if(password === re_typePass){
        if(acceptable_pass.test(password)){
            isValid = true;
            // alert("Valid!")
        } else {
            alert("Password is not Valid, atleast one upper, lower case, digit, special characters ")
        }  
    } else {
        alert("Password didn't matched!")
    }

    return isValid

}


export default useValidatePass