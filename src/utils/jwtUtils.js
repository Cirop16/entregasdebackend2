import { sign, verify } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;
const generateToken = (user) => sign({ id: user._id }, secretKey, { expiresIn: '1h' });
const verifyToken = (token) => verify(token, secretKey);

export default { generateToken, verifyToken };