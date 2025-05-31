import { hash,compare } from "bcryptjs";
import { verify } from "jsonwebtoken";

async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

async function verifyPassword(plaintextPassword, hashedPassword) {
  const isMatch = await compare(plaintextPassword, hashedPassword);
  return isMatch;
}

 function verifyToken(token,secretKey){
  try{
     const result= verify(token,secretKey);
     return {email:result.email};
  } catch(err){
    console.log(err);
    return false;
  }
}


export { hashPassword , verifyPassword ,verifyToken};
