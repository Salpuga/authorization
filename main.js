import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require('./config.json');
console.log(config);
import {useStore} from "./functions.js";
import(`./${config.store}.js`).then((module) => {
    console.log(module);
    const store = module;
    const {registerUsers,loginUser, setPassword} = useStore({store: store.configure(config[config.store])});

    const express = require('express');
    const app = express();

    app.use(express.json());

    // register new user
    app.post('/users',async (req,res)=> {
        try{
            registerUsers(
                req.body.name
                ,req.body.password 
                ,res
                ).then(() => {
                    res.status(200).send('good');
                }).catch((error) => {
                    res.status(500).send(error);
                });
        }catch(error){
            console.log(error);
            res.status(500).send();
        } 
    })

    // login 
    app.post('/login', async (req, res)=> {
        try{
            loginUser(req.body.name,req.body.password)
            .then(() => {
                res.status(200).send();
            }).catch((error) => {
                res.status(500).send(error);
            });
        }catch(error){
            console.log(error);
            res.status(500).send();
        }
    })

    // return all users 
    app.get('/users', (req, res)=> {
        getUsers(res);
    })

    // set-password
    app.post('/users/set-password', async (req,res)=>{
        try{
            setPassword(req.body.name, req.body.password, res, req).then(() => {
                res.status(200).send();
            }).catch(() => {
                res.status(500).send('');
            });
        }catch(error){
            console.log(error);
            res.status(500).send();
        }
    })

    app.listen(4000);
});