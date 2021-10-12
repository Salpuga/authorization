import { createRequire } from "module";

const require = createRequire(import.meta.url);
const bcrypt = require('bcrypt');


const genSalt = async () => {
    let salt = await bcrypt.genSalt(10);
    return salt;
}

const bcryptPassword = async (pass) => {
    let salt = await genSalt();
    const hasedPassword = await bcrypt.hash(pass, salt);
    let hash = hasedPassword;
    return {hash, salt};
} 

const verifyPassword = async (pass,hash,salt) => {
    const hasedPassword = await bcrypt.hash(pass, salt);
    console.log(hasedPassword);
    if (hash === hasedPassword ){
        console.log("True");
        return true;
    }else{
        console.log("False");
        return false;
    }
}

export {bcryptPassword, verifyPassword};