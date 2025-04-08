import { hashSync, compareSync } from 'bcrypt';

const hashPassword = (password) => hashSync(password, 10);

const comparePassword = (password, hashedPassword) => compareSync(password, hashedPassword);

export default { hashPassword, comparePassword };