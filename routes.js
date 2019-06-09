const express = require('express');
const generalController = require('./controllers/general');
const studentController = require('./controllers/student');
const teacherController = require('./controllers/teacher');
const managementController = require('./controllers/management');

module.exports = (app) => {
  app.use(express.static(__dirname + '/public'))

  app.get('/api/state', generalController.getState)

  // Student
  app.get('/api/students/:pin',
    generalController.state('vote'),
    studentController.login)
  app.get('/api/students/:pin/positions',
    generalController.state('vote'),
    studentController.positions)
  app.post('/api/students/:pin',
    generalController.state('vote'),
    studentController.vote)

  // Teacher
  app.get('/api/teachers/:pin',
    generalController.state('vote'),
    teacherController.login)
  app.get('/api/teachers/:pin/positions',
    generalController.state('vote'),
    teacherController.positions)
  app.post('/api/teachers/:pin',
    generalController.state('vote'),
    teacherController.vote)

  // Management
  app.get('/api/management/:pin',
    generalController.state('vote'),
    managementController.login)
  app.get('/api/management/:pin/positions',
    generalController.state('vote'),
    managementController.positions)
  app.post('/api/management/:pin',
    generalController.state('vote'),
    managementController.vote)
}