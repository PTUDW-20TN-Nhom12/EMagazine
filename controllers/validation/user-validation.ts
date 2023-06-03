import { User } from "../../models/user";

export class UserValidation {
  validate(user: User, repassword: string) {
    if (!this.validateEmail(user.email))
      return {"valid": false, "message": "Email is invalid"}; 

    const validatePasswordResult = this.validatePassword(user.password, repassword); 
    if (!validatePasswordResult.valid) 
      return {"valid": false, "message": validatePasswordResult.error}; 

    return {"valid": true}
  }

  private static EMAIL_REGEX_PATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private validateEmail(email: string) : boolean {
    return UserValidation.EMAIL_REGEX_PATTERN.test(email);
  }

  private validatePassword(password: string, repassword: string) { 
    if (password.length < 8) 
      return {"valid": false, "error": "Length of password must be greater than 8"}; 
    if (password != repassword) 
      return {"valid": false, "error": "Password and Repassword not match"}; 
    return {"valid": true};
  } 
}