const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = (plainPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

exports.comparePassword = (userPassword, storedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(userPassword, storedPassword, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
