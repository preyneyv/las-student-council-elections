const { Student, Position } = require('../../database');
const Papa = require('papaparse');

exports.list = async (req, res) => {
  res.send(await Student.find())
}

// Returns a unique pin
async function getPin(usedPins = null) {
  const g = () => Math.floor(Math.random() * 9000 + 1000).toString();
  let pin

  if (!usedPins)
    usedPins = (await Student.find().select('pin')).map(s => s.pin);
  
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
  const vFields = [ 'Name', 'Grade', 'Section', 'House' ];
  const fields = result.meta.fields;
  const valid = fields.every(f => vFields.includes(f))
             && vFields.every(f => fields.includes(f))
             && vFields.length === fields.length;
  
  if (!valid)
    return res.status(422).send('"The file provided does not match the required format."')

  const toInsert = result.data.map(f => ({
    name: f.Name,
    grade: f.Grade,
    section: f.Section,
    house: f.House,
  }));

  // Clear existing votes from students
  await Position.updateMany({}, {
    $set: { 'candidates.$[].studentVotes': [] }
  })

  // Delete all students
  await Student.deleteMany({})

  // insert new students
  let usedPins = [],
      promises = [];
  for (let doc of toInsert) {
    doc.pin = await getPin(usedPins);
    usedPins.push(doc.pin);
    promises.push((new Student(doc)).save());
  }

  await Promise.all(promises);

  res.send('"Successfully imported!"')
}

// export to csv
exports.export = async (req, res) => {
  let students = await Student.find().select('name grade section house pin -_id');
  students = JSON.parse(JSON.stringify(students))
  
  const csv = Papa.unparse(students, {
    header: true,
  })

  res.contentType('text/csv');
  res.send(csv);
}