const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
        user : "majimakcurrum@gmail.com",
        pass: "fkqq pbwr jeds zwrw"
    },
});

module.exports = transporter;