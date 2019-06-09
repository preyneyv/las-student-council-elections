const { Option, Student, Teacher, Management, Position, Candidate } = require('../../database');

const defaults = {
  state: 'setup'
}

exports.stats = async (req, res) => {
  const counts = {
    students: await Student.countDocuments(),
    teachers: await Teacher.countDocuments(),
    management: await Management.countDocuments(),
    positions: await Position.countDocuments(),
    candidates: await Candidate.countDocuments()
  }
  res.send(counts)
}

async function getOption(key) {
  const option = await Option.findOne({ key });
  if (option)
    return option.value;
  else
    return defaults[key];
}

exports.get = async (req, res) => {
  const key = req.params.key;
  res.send({ [key]: await getOption(key) })
}

exports.set = async (req, res) => {
  const key = req.params.key;
  const value = req.post.value;

  let oldValue;
  if (key === 'state')
    oldValue = await getOption(key);
  
  await Option.findOneAndUpdate({ key }, { value }, { upsert: true });
  
  if (key === 'state')
    await initializeState(value, oldValue)

  res.send({ success: true });
}

async function initializeState(state, previous) {
  if (state === 'setup') {
    // Reset all votes
    await Position.updateMany({}, { $set: {
      'candidates.$[].teacherVotes': [],
      'candidates.$[].studentVotes': [],
      'candidates.$[].managementVotes': [],
    } })

    // Reset PIN status
    await Student.updateMany({}, { used: false, voted: false });
    await Teacher.updateMany({}, { used: false, voted: false });
    await Management.updateMany({}, { used: false, voted: false });

  } else if (state === 'vote') {

  } else if (state === 'results') {

  }
}
