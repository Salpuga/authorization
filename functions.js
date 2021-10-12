import { verifyPassword, bcryptPassword} from "./hashed.js";


let store = null;

const registerUsers = async (reqName,reqPassword) => {
    console.log('register');
    return new Promise (async (resolve, reject) => {
        const userInDataBase =  await store.findUser(reqName);
        if(userInDataBase != null){
            reject('User already exist');
            return;
        }else{
            resolve();
        }
        let hash =  await bcryptPassword(reqPassword);
        console.log(hash);
        const user = {
            name: reqName
            ,salt: hash.salt
            ,hash: hash.hash 
        };
        // add data to database
       await store.addUserToDatabase(user);
       //await addUserToDatabase(user);
    }); 
}

const loginUser = async (reqName, reqPassword) => {
    console.log('login');
          return new Promise(async(resolve,reject) => {
            const userInDataBase =   await store.findUser(reqName);
            //!userInData === false тогда сработает if
            if (!await userInDataBase){
                console.log("if popal");
                reject('Login or password invalid')
                return;
            }
            console.log(userInDataBase);
            console.log(reqPassword);
            if (!await verifyPassword(
                reqPassword
                ,userInDataBase.hash 
                ,userInDataBase.salt
                )){
                reject('Login or password invalid 1');
                return;
            }
            resolve('true');
          })
  }

const setPassword = async (reqName, reqPassword, res, req) => {
    console.log('set-password');
    return new Promise(async (resolve,reject) => {
        const userInDataBase = await store.findUser(reqName);

        if(userInDataBase == null){
            reject('Cant find')
            return;
        }

        if (!verifyPassword(
                req.body.currentPassword
                ,userInDataBase.hash 
                ,userInDataBase.salt
            )){
                reject('Invalid password ');
                return;
            }

        userInDataBase.password = reqPassword;
        let newHash = await bcryptPassword(
            userInDataBase.password
            ,userInDataBase.salt
        );

        userInDataBase.hashedPassword = newHash.hash;
        userInDataBase.salt = newHash.salt;
        await store.updateUserInDatabase(userInDataBase,reqName);
        })
}

const useStore = (config) => {
    store = config.store;
    return {registerUsers,loginUser, setPassword};
};

export {useStore};