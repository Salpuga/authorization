import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mysql = require("mysql2");

//conection to database
let connection = null;

const addUserToDatabase = async (user) => {
    return new Promise ((resolve, reject) => {
        const userData = [`${user.name}`, `${user.salt}`, `${user.hash}`]
        const addSQL = 'INSERT INTO users(name, salt, hash) VALUES(?,  ?, ?)';
        connection.query(addSQL, userData, function(err, results){
            if(err){
                console.log(err);
                reject('error with database');            
            }
            else{
                console.log("Данные добавлены");
                resolve('ok');
            }
        })
    })
}

const updateUserInDatabase = async (userInDataBase,reqName) => {
    return new Promise((resolve,reject) => {
        const params = [
            userInDataBase.hashedPassword 
            ,userInDataBase.salt
            ,reqName
        ];
        const update = `
            UPDATE users 
            SET hash = ?
                ,salt = ? 
            WHERE name = ?`
            ;
        connection.query(update,params,function(err,results){
            if(err){
                console.log(err);
                reject('ivalid password or login');
            }else{
                resolve('ok')
            }
        })
    })
}

const findUser = async (userName) => {
    return new Promise (async (resolve, reject) => {
        const params = [userName];
        const selectAll = `SELECT * FROM  users WHERE name = ? LIMIT 1`;
        connection.query(selectAll,params,
            function(err, results) {
              console.log(err);
              console.log(results);
              if (results.length > 0){
                resolve (results[0]); 
              }else{
                  resolve(null);
              }
            
          }); 
    });
}

const getUsers = async (res) => {
    return new Promise((resolve, reject) => {
        const selectAll = `SELECT * FROM  users`;
          connection.query(selectAll,[],
              function(err, results) {
                console.log(err);
                console.log(results);
                res.json(results);
            }); 
    })
  }


const configure = (config) => {
    connection = mysql.createConnection(config);
    
    connection.connect(function(err){
        if (err) {
          return console.error("Ошибка: " + err.message);
        }
        else{
          console.log("Подключение к серверу MySQL успешно установлено");
        }
     });
    return {addUserToDatabase,findUser,getUsers, updateUserInDatabase}
};


export  {configure} ;