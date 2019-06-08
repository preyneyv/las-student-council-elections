const { Position, Management } = require('../../database');
const Papa = require('papaparse');

exports.list = async (req, res) => {
  res.send(await Management.find())
}

// Returns a unique pin
async function getPin(usedPins = null) {
  const g = () => Math.floor(Math.random() * 9000 + 1000).toString();
  let pin

  if (!usedPins)
    usedPins = (await Management.find().select('pin')).map(s => s.pin);

  if (usedPins.length > 800)
    throw new Error("Running out of pins!");

  while (usedPins.includes(pin = g())) { }
  return pin
}

exports.create = async (req, res) => {
  const { name } = req.post;

  const pin = await getPin()

  const management = new Management({
    name, pin
  });

  await management.save()
  res.send({ success: true, management });
}

exports.delete = async (req, res) => {
  const management = await Management.findByIdAndDelete(req.params.id);
  if (!management)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.managementVotes': management._id }, {
    $pull: {
      'candidates.$.managementVotes': management._id
    }
  })

  res.status(204).send({ success: true })
}

exports.find = async (req, res) => {
  const management = await Management.findById(req.params.id)
  if (management)
    res.send(management)
  else
    res.status(404).send({ success: false })
}

exports.update = async (req, res) => {
  const { house, name } = req.post;
  const management = await Management.findByIdAndUpdate(req.params.id, {
    house, name
  });
  if (!management)
    res.status(404).send({ success: false })

  res.send({ success: true });
}

exports.reset = async (req, res) => {
  const management = await Management.findByIdAndUpdate(req.params.id, {
    used: false,
    voted: false
  });
  if (!management)
    return res.status(404).send({ success: false })

  // Remove existing votes
  await Position.updateMany({ 'candidates.managementVotes': management._id }, {
    $pull: {
      'candidates.$.managementVotes': management._id
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
  const vFields = ['Name'];
  const fields = result.meta.fields;
  const valid = fields.every(f => vFields.includes(f))
    && vFields.every(f => fields.includes(f))
    && vFields.length === fields.length;

  if (!valid)
    return res.status(422).send('"The file provided does not match the required format."')

  const toInsert = result.data.map(f => ({
    name: f.Name,
  }));

  // Clear existing votes from management
  await Position.updateMany({}, {
    $set: { 'candidates.$[].managementVotes': [] }
  })

  // Delete all management
  await Management.deleteMany({})

  // insert new management
  let usedPins = [],
    promises = [];
  for (let doc of toInsert) {
    doc.pin = await getPin(usedPins);
    usedPins.push(doc.pin);
    promises.push((new Management(doc)).save());
  }

  await Promise.all(promises);

  res.send('"Successfully imported!"')
}

// export to csv
exports.export = async (req, res) => {
  let management = await Management.find().select('name house pin -_id');
  management = JSON.parse(JSON.stringify(management))

  const csv = Papa.unparse(management, {
    header: true,
  })

  res.contentType('text/csv');
  res.send(csv);
}