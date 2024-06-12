const { executeSQL } = require("./server/database");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'SokratesSecretCodeSecret';

/**
 * Registers a user.
 * @param {UserRegisterDTO} content 
 * @returns {boolean}
 */
async function register(content){
    if(!content || !content.username || !content.password || !content.displayname){
        return false;
    }
    try{
        const hashedPassword = await bcrypt.hash(content.password, 8);
        await executeSQL("INSERT INTO users (name, password, displayname) VALUES (?, ?, ?);", [content.username, hashedPassword, content.displayname]);
        return true;
    } catch(error){
        console.error('Database error:', error);
        return false;
    }
};

/**
 * Logs in a user.
 * @param {UserLoginDTO} content 
 * @returns {Object}
 */
async function login(content){
    if(content === null){
        return {};
    }
    try {
        const user = await executeSQL("SELECT * FROM users WHERE name = ?;", [content.username]);
        if (user.length === 0) {
            return {};
        }

        const isPasswordValid = await bcrypt.compare(content.password, user[0].password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: user[0].id, username: user[0].name }, SECRET_KEY, { expiresIn: '1h' });
            return { token, displayname: user[0].displayname, id: user[0].id };
        } else {
            return {};
        }
    } catch (error) {
        console.error('Database error:', error);
        return false;
    }
}

class UserRegisterDTO {
    username;
    password;
    displayname;
}

class UserLoginDTO {
    username;
    password;
}

module.exports = { register, login };