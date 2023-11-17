const { users } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../helper/mailer");

module.exports = {
  // FEAT-REGIS
  getData: async (req, res, next) => {
    try {
      const result = await users.findAll();
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  // FEAT-REGIS
  register: async (req, res, next) => {
    try {
      // Lanjut register
      const isExist = await users.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (isExist) {
        return res.status(400).send({
          success: false,
          message: "Your password is not valid, please check password",
        });
      }
      delete req.body.confirmPassword;
      // HASH PASSWORD
      const salt = await bcrypt.genSalt(10);

      const hashPassword = await bcrypt.hash(req.body.password, salt);

      req.body.password = hashPassword;
      // await users.create(req.body);

      const result = await users.create(req.body);
      console.log(result);

      console.log((result.id, result.email));
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
        },
        process.env.SCRT_TKN,
        {
          expiresIn: "1h",
        }
      );
      // console.log(token);

      // SEND EMAIL REGISTRATION
      await transporter.sendMail({
        from: "SOCIO ADMIN",
        to: req.body.email,
        subject: "Registration Info",
        html: `<h1> Hello, ${req.body.username}, your registration SUCCESS</h1>
                <a href="http://localhost:5173/verification/${token}">Click Link</a>`,
      });

      return res.status(201).send({
        success: false,
        message: "Account is exist",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  verify: async (req, res, next) => {
    try {
      // Mendapatkan user ID dari token
      const userId = req.userData.id;

      // Menggunakan Sequelize atau ORM lainnya, Anda dapat melakukan update pada kolom isVerified
      // Berdasarkan userId
      await users.update(
        { isVerified: true },
        {
          where: {
            id: req.userdata.id, // req.userdata ini dari middleware penerjemahan token
          },
        }
      );

      return res.status(200).send({
        success: true,
        message: "Verification account SUCCESS",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  login: async (req, res, next) => {
    try {
      console.log("CHECK DATA LOGIN", req.body);
      const result = await users.findOne({
        where: {
          email: req.body.email,
        },
        raw: true,
      });
      console.log(result);
      const isValid = await bcrypt.compare(req.body.password, result.password);
      console.log(isValid);

      if (isValid) {
        delete result.password;

        //GENARATE TOKEN
        const { id, email, phone, role, isVerified } = result;
        const token = jwt.sign(
          {
            id,
            role,
            isVerified,
          },
          process.env.SCRT_TKN,
          {
            expiresIn: "1h",
          }
        );
        console.log(token);
        return res.status(200).send({
          success: true,
          result: {
            email,
            phone,
            isVerified,
            token,
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "You unauthenticate",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  keepLogin: async (req, res, next) => {
    try {
      console.log(req.userData);
      // #menerjemahkan token / decription token
      const result = await users.findOne({
        where: {
          id: req.userData.id,
        },
        raw: true,
      });

      console.log(result);
      const { id, username, email, phone, role, isVerified } = result;
      const token = jwt.sign(
        { id, username, role, isVerified },
        process.env.SCRT_TKN,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({
        success: " true",
        result: {
          username,
          email,
          phone,
          isVerified,
          token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
