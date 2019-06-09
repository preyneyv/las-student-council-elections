const { Option, Student, Teacher, Management, Candidate, Position } = require('../database');

exports.login = async (req, res) => {
  const pin = req.params.pin;
  const teacher = await Teacher.findOne({ pin });
  if (!teacher) {
    return res.status(404).send({ success: false, message: 'Incorrect PIN entered!' })
  }

  if (teacher.used) {
    return res.status(422).send({ success: false, message: 'PIN has already been used!' })
  }

  res.send({ success: true, teacher });
}

exports.positions = async (req, res) => {
  const pin = req.params.pin;
  const teacher = await Teacher.findOne({ pin });
  if (!teacher)
    return res.status(404).send({ success: false, message: 'Incorrect PIN entered!' })
  if (teacher.used)
    return res.status(422).send({ success: false, message: 'PIN has already been used!' })

  await teacher.update({ used: true }); // mark the pin as used
  // Find all positions that the teacher can vote for.
  const positions = await Position.find({
    $or: [
      { house: '' },
      { house: teacher.house },
    ]
  })
    .populate('candidates.candidate')
    .select('-candidates.studentVotes -candidates.teacherVotes -candidates.managementVotes');

  res.send({ success: true, positions });
}

exports.vote = async (req, res) => {
  const pin = req.params.pin;
  const teacher = await Teacher.findOne({ pin });
  if (!teacher)
    return res.status(404).send({ success: false, message: 'Incorrect PIN entered!' })
  if (!teacher.used)
    return res.status(422).send({ success: false, message: 'Teacher has not yet logged in!' })
  if (teacher.voted)
    return res.status(422).send({ success: false, message: 'Teacher has already cast their vote!' })

  // Ensure the provided ids are all valid
  const validPromises = Object.entries(req.post).map(
    ([positionId, posCandId]) => Position.findOne({
      _id: positionId,
      'candidates._id': posCandId
    })
  );
  const valid = (await Promise.all(validPromises)).every(p => p)
  if (!valid)
    return res.status(422).send({ success: false, message: 'Invalid IDs provided.' });

  // Save votes
  for (let [positionId, posCandId] of Object.entries(req.post)) {
    await Position.updateOne({
      "_id": positionId,
      "candidates._id": posCandId
    }, {
        $push: {
          'candidates.$.teacherVotes': teacher._id
        }
      })
  }

  // Update state
  await teacher.update({ voted: true });

  res.send({ success: true, message: 'Votes successfully recorded!' });
}