const validatePass = (password: string, re_typePass: string): boolean => {
    
    const acceptable_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,}$/;
  
    
    return password === re_typePass && acceptable_pass.test(password);
  };
  
  export default validatePass;
  