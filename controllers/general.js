const { Option, Student, Teacher, Management, Candidate, Position } = require('../database');
const options = require('../admin/controllers/options');

exports.getState = async (req, res) => {
  res.send(await options.getOption('state'));
}

// middleware to check that the current state is equal to `target`
exports.state = (target) => async (req, res, next) => (await options.getOption('state')) == target ? next() : res.status(503).send({ success: false, message: 'Application is not open for voting!' })