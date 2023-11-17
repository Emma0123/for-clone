const { templateResponse } = require("../helper/utils");
const { tweets, users } = require("../models");
const db = require("../models");
const fs = require("fs");
const { clientRedis } = require("../helper/redis");

module.exports = {
  createTweets: async (req, res, next) => {
    const t = await db.sequelize.transaction();

    try {
      const result = await tweets.create(
        {
          userId: req.userData.id,
          tweet: req.body.tweet,
          img: req.file.filename,
        },
        {
          transaction: t,
        }
      );

      await t.commit(); // menandakan jika sql tidak ada error maka result akan disimpan
      return res.status(200).send({
        success: true,
        result,
      });
    } catch (error) {
      await t.rollback(); // Jika sql error maka semua perintah akan dikembalikan ke kondisi sebelumnya
      console.log(error);
      fs.unlinkSync(`./${req.file.path}`); //menghapus file

      return res.status(500).send({
        success: false,
        message: "Error create tweet",
        error,
      });
    }
  },

  getTweet: async (req, res, next) => {
    try {

      // 1. Check data in redis exist or not
      const redisData = await clientRedis.get("getAllTweet");

      // 2. Check redisData exist or not
      if (redisData) {
        console.log("WITH REDIS");
        // If exist data from redis send as response
        res.status(200).send(redisData);
      } 
        //3. If redisData not exist get data from database
        const result = await tweets.findAll({
          include: [
            {
              model: users,
              attributes: ["username", "email"],
              required: true,
            },
          ],
        });

        // 4. Store data in redis, expires in 60s
        await clientRedis.setEx("getAllTweet", 60, JSON.stringify(result));

        // 5. Send response
        return res.status(200).send(result);
      

    } catch (error) {
      next(templateResponse(500, false, "Error get", null, error.message));
      next({
        rc: 500,
        success: "false",
        message: "Error get tweet",
        error: error.message,
      });
    }
  },
};
