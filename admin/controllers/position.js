const { Position } = require('../../database');

exports.create = (req, res) => {
  let { position, grades, section, house, candidates } = req.post;
  
  let uniqueGrades = [];
  grades.forEach(grade => !uniqueGrades.includes(grade) && uniqueGrades.push(grade))

  // save the position
  const newPosition = new Position({
    position,
    grades: uniqueGrades,
    section,
    house,
    candidates: candidates.map((candidate) => ({ candidate }))
  })

  newPosition.save()
  .then(() => console.log('Created new position', position))
  .then(() => res.send({ success: true, position: newPosition }))
  .catch(e => {
    res.status(500).send({ success: false })
    throw e
  })
}

// get all positions
exports.list = async (req, res) => {
  const populate = req.query.with || "";
  const positions = await Position.find().populate(populate)
  res.send(positions)
}

// delete a position
exports.delete = async (req, res) => {
  const position = await Position.findByIdAndDelete(req.params.id);
  if (position)
    res.status(204).send({ success: true, position });
  else
    res.status(404).send({ success: false })
}

// get a position by id
exports.find = async (req, res) => {
  const populate = req.query.with || "";

  const position = await Position.findById(req.params.id).populate(populate)
  if (position)
    res.send(position)
  else
    res.status(404).send({ success: false })
}

// update a position
exports.update = async (req, res) => {
  const id = req.params.id;
  let { position, grades, section, house, candidates } = req.post;

  let uniqueGrades = [];
  grades.forEach(grade => !uniqueGrades.includes(grade) && uniqueGrades.push(grade))

  const updatedPosition = await Position.findByIdAndUpdate(id, {
    position,
    grades: uniqueGrades,
    section,
    house,
    candidates: candidates.map(candidate => ({ candidate }))
  }, { new: true })

  if (updatedPosition)
    res.send({ success: true, position: updatedPosition })
  else
    res.status(404).send({ success: false })
}

exports.associateCandidate = async (positionId, candidateId) => {
  const position = await Position.findById(positionId)

  if (position.candidates.every(run => run.candidate.toString() != candidateId)) {
    // Unique
    position.candidates.push({ candidate: candidateId })
  }
  await position.save();
}