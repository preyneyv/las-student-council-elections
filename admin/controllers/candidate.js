const positionController = require('./position');

const { Candidate, Position } = require('../../database');

exports.create = async (req, res) => {
  let { name, grade, section, house, tagline, description, positions } = req.body;
  const { image } = req.files;

  positions = positions.split(',')
  const candidate = new Candidate({
    name, grade, section,
    house, tagline, description,
    image: {
      data: image.data,
      contentType: image.mimetype
    }
  });

  candidate.save()
  .then(
    () => Promise.all(positions.map(pId => positionController.associateCandidate(pId, candidate._id)))
  )
  .then(() => console.log('Created new candidate', name))
  .then(() => res.send({ success: true }))
  .catch(e => {
    res.status(500).send({ success: false })
    throw e
  })
}

exports.getImage = async (req, res) => {
  const candidate = await Candidate.findById(req.params.id).select('+image');
  if (!candidate)
    return res.status(404).send({ message: 'Not Found', success: false })

  res.contentType(candidate.image.contentType)
  res.end(candidate.image.data.buffer, 'binary');
}

exports.list = async (req, res) => {
  const populate = req.query.with || ""
  res.send(await Candidate.find().populate(populate))
}

exports.delete = async (req, res) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id).populate('positions');
  if (!candidate)
    return res.status(404).send({ success: false });

  // Delete association
  await Position.updateMany({
    'candidates.candidate': candidate._id
  }, { $pull: { candidates: { candidate: candidate._id } } })

  return res.send({ success: true });
}

exports.find = async (req, res) => {
  const populate = req.query.with || "";
  const candidate = await Candidate.findById(req.params.id).populate(populate);
  if (candidate)
    res.send(candidate)
  else
    res.status(404).send({ success: false })
}

exports.update = async (req, res) => {
  const { id } = req.params;
  let { name, grade, section, house, tagline, description, positions } = req.body;
  let image = null
  if (req.files) {
    image = req.files.image;
  }

  const update = { name, grade, section, house, tagline, description };
  if (image) {
    update.image = {
      data: image.data,
      contentType: image.mimetype
    }
  }
  positions = positions.split(',')
  const updatedCandidate = await Candidate.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!updatedCandidate)
    res.status(404).send({ success: false });

  updatedCandidate.save()
  .then(() => Position.updateMany({}, { $pull: { candidates: { candidate: updatedCandidate._id } } }))
  .then(() => Promise.all(positions.map(pId => positionController.associateCandidate(pId, updatedCandidate._id))))
  .then(() => console.log('Created new candidate', name))
  .then(() => res.send({ success: true }))
  .catch(e => {
    res.status(500).send({ success: false })
    throw e
  })
}