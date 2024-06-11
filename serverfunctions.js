const { executeSQL } = require("./server/database");

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
        await executeSQL("INSERT INTO users (name, password, displayname) VALUES (?, ?, ?);", [content.username, content.password, content.displayname]);
        return true;
    } catch{
        console.error('Database error:', error);
        return false;
    }
};


async function login(content){
    if(content === null){
        return {};
    }
    try {
        const user = await executeSQL("SELECT * FROM users WHERE name = ?;", [content.username]);
        if (user.length === 0) {
            return {};
        }

        if (content.password === user[0].password) {
            return user;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Database error:', error);
        return false;
    }
}

class UserRegisterDTO{
    username;
    password;
    displayname;
}

class UserLoginDTO{
    username;
    password;
}

module.exports = { register, login };