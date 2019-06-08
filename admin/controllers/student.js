const { Student, Position } = require('../../database');

exports.list = async (req, res) => {
  res.send(await Student.find())
}

// Returns a unique pin
async function getPin() {
  const g = () => Math.floor(Math.random() * 9000 + 1000).toString();
  let pin
  const usedPins = (await Student.find().select('pin')).map(s => s.pin);
  if (usedPins.length > 800)
    throw new Error("Running out of pins!");

  while (usedPins.includes(pin = g())) { }
  return pin
}

exports.create = async (req, res) => {
  const { grade, section, house, name } = req.post;

  const pin = await getPin()

  const student = new Student({
    grade, section, house,
    name, pin
  });
  
  await student.save()
  res.send({ success: true, student });
}

exports.delete = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.studentVotes': student._id }, {
    $pull: {
      'candidates.$.studentVotes': student._id
    }
  })

  res.status(204).send({ success: true })
}

exports.find = async (req, res) => {
  const student = await Student.findById(req.params.id)
  if (student)
    res.send(student)
  else
    res.status(404).send({ success: false })
}

exports.update = async (req, res) => {
  const { grade, section, house, name } = req.post;
  const student = await Student.findByIdAndUpdate(req.params.id, {
    grade, section, house, name
  });
  if (!student)
    res.status(404).send({ success: false })
  
  res.send({ success: true });
}

exports.reset = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, {
    used: false,
    voted: false
  });
  if (!student)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.studentVotes': student._id }, {
    $pull: {
      'candidates.$.studentVotes': student._id
    }
  });

  res.send({ success: true })
}