const { Position, Teacher } = require('../../database');
const Papa = require('papaparse');

exports.list = async (req, res) => {
  res.send(await Teacher.find())
}

// Returns a unique pin
async function getPin(usedPins = null) {
  const g = () => Math.floor(Math.random() * 9000 + 1000).toString();
  let pin

  if (!usedPins)
    usedPins = (await Teacher.find().select('pin')).map(s => s.pin);

  if (usedPins.length > 800)
    throw new Error("Running out of pins!");

  while (usedPins.includes(pin = g())) { }
  return pin
}

exports.create = async (req, res) => {
  const { house, name } = req.post;

  const pin = await getPin()

  const teacher = new Teacher({
    house, name, pin
  });

  await teacher.save()
  res.send({ success: true, teacher });
}

exports.delete = async (req, res) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.teacherVotes': teacher._id }, {
    $pull: {
      'candidates.$.teacherVotes': teacher._id
    }
  })

  res.status(204).send({ success: true })
}

exports.find = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
  if (teacher)
    res.send(teacher)
  else
    res.status(404).send({ success: false })
}

exports.update = async (req, res) => {
  const { house, name } = req.post;
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, {
    house, name
  });
  if (!teacher)
    res.status(404).send({ success: false })

  res.send({ success: true });
}

exports.reset = async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, {
    used: false,
    voted: false
  });
  if (!teacher)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.teacherVotes': teacher._id }, {
    $pull: {
      'candidates.$.teacherVotes': teacher._id
    }
  });

  res.send({ success: true })
}

// import a csv file
exports.import = async (req, res) => {
  const file = req.files.file;
  if (file.mimetype !== 'text/csv') {
    return res.status(422).send('"Not a csv file!"')
  }
  const data = file.data.toString();
  const result = Papa.parse(data, {
    header: true,
    skipEmptyLines: true
  });
  const vFields = ['Name', 'House'];
  const fields = result.meta.fields;
  const valid = fields.every(f => vFields.includes(f))
    && vFields.every(f => fields.includes(f))
    && vFields.length === fields.length;

  if (!valid)
    return res.status(422).send('"The file provided does not match the required format."')

  const toInsert = result.data.map(f => ({
    name: f.Name,
    house: f.House,
  }));

  // Clear existing votes from teachers
  await Position.updateMany({}, {
    $set: { 'candidates.$[].teacherVotes': [] }
  })

  // Delete all teachers
  await Teacher.deleteMany({})

  // insert new teachers
  let usedPins = [],
    promises = [];
  for (let doc of toInsert) {
    doc.pin = await getPin(usedPins);
    usedPins.push(doc.pin);
    promises.push((new Teacher(doc)).save());
  }

  await Promise.all(promises);

  res.send('"Successfully imported!"')
}

// export to csv
exports.export = async (req, res) => {
  let teachers = await Teacher.find().select('name house pin -_id');
  teachers = JSON.parse(JSON.stringify(teachers))

  const csv = Papa.unparse(teachers, {
    header: true,
  })

  res.contentType('text/csv');
  res.send(csv);
}