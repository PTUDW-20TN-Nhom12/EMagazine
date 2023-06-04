import bcrypt from 'bcrypt';

export class PasswordHelper {
  async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

async function run() {
  let passwordHelper = new PasswordHelper(); 

  const password = '123123';
  const password2 = '1231231';
  const hashedPassword = await passwordHelper.encryptPassword(password);

  const isMatch = await passwordHelper.comparePasswords('123123', hashedPassword);
  console.log('Passwords Match:', isMatch);
}

run();