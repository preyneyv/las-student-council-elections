const mongoose = require('mongoose');
const config = require('./config')

const { Schema } = mongoose;


mongoose.connect(config.dbUri)

const positionSchema = new Schema({
  position: String,
  grades: [ Number ],
  section: {
    type: String,
    default: null
  },
  house: {
    type: String,
    default: null
  },
  candidates: [
    {
      candidate: {
        type: Schema.Types.ObjectId,
        ref: "Candidate"
      },
      studentVotes: [{
        type: Schema.Types.ObjectId,
        ref: "Student"
      }],
      teacherVotes: [{
        type: Schema.Types.ObjectId,
        ref: "Teacher"
      }],
      managementVotes: [{
        type: Schema.Types.ObjectId,
        ref: "Management"
      }]
    }
  ]
});

const candidateSchema = new Schema({
  name: String,
  grade: Number,
  section: String,
  house: String,
  tagline: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: {
      data: Buffer,
      contentType: String
    },
    select: false
  }
});

candidateSchema.virtual('positions', {
  ref: 'Position',
  localField: '_id',
  foreignField: 'candidates.candidate'
});

const studentSchema = new Schema({
  pin: {
    type: String,
    index: { unique: true }
  },
  grade: Number,
  section: String,
  house: String,
  name: String,
  used: {
    type: Boolean,
    default: false
  },
  voted: {
    type: Boolean,
    default: false
  }
});

const teacherSchema = new Schema({
  pin: String,
  name: String,
  house: String,
  used: {
    type: Boolean,
    default: false
  },
  voted: {
    type: Boolean,
    default: false
  }
});

const managementSchema = new Schema({
  pin: String,
  name: String,
  house: String,
  used: {
    type: Boolean,
    default: false
  },
  voted: {
    type: Boolean,
    default: false
  }
})


candidateSchema.set('toJSON', {
  virtuals: true
}).set('toObject', {
  virtuals: true
}) 
module.exports = {
  Candidate: mongoose.model('Candidate', candidateSchema),
  Position: mongoose.model('Position', positionSchema),
  Student: mongoose.model('Student', studentSchema),
  Management: mongoose.model('Management', managementSchema),
  Teacher: mongoose.model('Teacher', teacherSchema)
}