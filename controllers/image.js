const { image } = require("../helper/utils");
const fs = require("fs");

module.exports = {
  multipleImage: async (req, res, next) => {
    try {
      const result = await tweets.create({
        userId: req.userData.id,
        tweet: req.body.tweet,
        img: req.files.filename,
      });

      return res.status(200).send({
        success : true,
        result 
      })
    } catch (error) {
      console.log(error);
      fs.unlinkSync(`./${req.file.path}`); //menghapus file
      
      return res.status(500).send({
        success: false,
        message: "Error create tweet",
        error
      });
    }
  },
};
