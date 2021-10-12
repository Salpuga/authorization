import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String
        ,require: true
    }
    ,hash: {
        type: String
        ,require: true
    }
    ,salt: {
        type: String
        ,require: true
    }
});

const User = mongoose.model('User', userSchema);

export { User };