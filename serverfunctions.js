const { executeSQL } = require("./server/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "SokratesSecretCodeSecret";

/**
 * Registers a user.
 * @param {UserRegisterDTO} content
 * @returns {boolean}
 */
async function register(content) {
  if (
    !content ||
    !content.username ||
    !content.password ||
    !content.displayname
  ) {
    return false;
  }
  try {
    const hashedPassword = await bcrypt.hash(content.password, 8);
    await executeSQL(
      "INSERT INTO users (name, password, displayname) VALUES (?, ?, ?);",
      [content.username, hashedPassword, content.displayname]
    );
    return true;
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}

/**
 * Logs in a user.
 * @param {UserLoginDTO} content
 * @returns {Object}
 */
async function login(content) {
  if (content === null) {
    return {};
  }
  try {
    const user = await executeSQL("SELECT * FROM users WHERE name = ?;", [
      content.username,
    ]);
    if (user.length === 0) {
      return {};
    }

    const isPasswordValid = await bcrypt.compare(
      content.password,
      user[0].password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        { id: user[0].id, username: user[0].name },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return { token, displayname: user[0].displayname, id: user[0].id };
    } else {
      return {};
    }
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}

async function getlastten() {
  try {
    const messages = await executeSQL(
      `SELECT * FROM (SELECT * FROM messages ORDER BY created_at DESC LIMIT 10) sub ORDER BY created_at ASC;`
    );

    if (messages.length === 0) {
      return [];
    }

    return messages;
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}

/**
 * Changes Displayname of user
 * @param {UserChangeNameDto} content
 * @returns {Object}
 */
async function changename(content) {
  if (content === null) {
    console.log("Content is null");
    return;
  }
  try {
    let user = await executeSQL("SELECT * FROM users WHERE id = ?", [
      content.id,
    ]);

    if (user.length === 0) {
      console.log("User not found");
      return null;
    }

    await executeSQL("UPDATE users SET displayname = ? WHERE id = ?", [
      content.displayname,
      content.id,
    ]);

    console.log(`Displayname updated to ${content.displayname}`);
    return { displayname: content.displayname };
  } catch (error) {
    console.error("Database error:", error);
    return false;
  }
}

class UserRegisterDto {
  username;
  password;
  displayname;
}

class UserChangeNameDto {
  id;
  displayname;
}

class UserLoginDto {
  username;
  password;
}

module.exports = { register, login, changename, getlastten };
