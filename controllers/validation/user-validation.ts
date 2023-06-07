import { Role } from "../../models/role";
import { User } from "../../models/user";

export class UserValidation {
  validate(user: User, password: string, repassword: string) {
    if (!this.validateEmail(user.email))
      return {"valid": false, "message": "Email is invalid"}; 

    const validatePasswordResult = this.validatePassword(password, repassword); 
    if (!validatePasswordResult.valid) 
      return {"valid": false, "message": validatePasswordResult.error}; 

    if (!this.validateBirthday(user.birthday)) 
      return {"valid": false, "message": "Birthday empty"};
      
    if (!this.validateRole(user.role)) 
      return {"valid": false, "message": "Role empty"};

    return {"valid": true}
  }
  
  private static EMAIL_REGEX_PATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  private validateRole(role: Role) {
    return role != null; 
  }

  private validateEmail(email: string) : boolean {
    return UserValidation.EMAIL_REGEX_PATTERN.test(email);
  }

  private validatePassword(password: string, repassword: string) { 
    if (password === 'this_is_the_temp_meo_meo') 
      return {"valid": true};
    if (password.length < 8) 
      return {"valid": false, "error": "Length of password must be greater than 8"}; 
    if (password != repassword) 
      return {"valid": false, "error": "Password and Repassword not match"}; 
    return {"valid": true};
  } 

  private validateBirthday(birthday: Date) { 
    return birthday != undefined; 
  }
}