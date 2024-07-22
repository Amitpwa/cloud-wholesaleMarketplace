const aboutSchema = require("../models/About");

const about = async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      var result = await aboutSchema.updateOne({ _id: data.id }, { ...data }).exec();
      res.send({
        success: true,
        message: "Successfully Updated!!!",
        result
      });
    } else {
      if (data.id == '') {
        delete data.id
      };
      const aboutData = new aboutSchema({ ...data });
      var result = aboutData.save()
      res.send({
        success: true,
        message: "Data Added!!",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const getAbout = async (req, res) => {
    try {
        var result = await aboutSchema.find().exec();

        res.send({
          success: true,
          message: "Successfully fetch!!!",
          result
        })
    } catch (err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    }
};

module.exports = {
  about,getAbout
};