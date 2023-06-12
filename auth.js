const argon2 = require("argon2");

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
}

const hashPassword = (req, res, next) => {

    argon2
        .hash(req.body.password, hashingOptions)
        .then((hashedPassword) => {
            req.body.hashedPassword = hashedPassword;
            delete req.body.password;

            next();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
};

module.exports = {
    hashPassword,
};