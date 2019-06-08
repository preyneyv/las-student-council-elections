const { Student } = require('../../database');

exports.list = async (req, res) => {
  res.send(await Student.find())
}