const express = require('express');
const positionController = require('./controllers/position');
const candidateController = require('./controllers/candidate');
const studentController = require('./controllers/student');
const teacherController = require('./controllers/teacher');

module.exports = (app) => {
  app.use(express.static(__dirname + "/public"))
  app.route('/api/positions/')
  .post(positionController.create)
  .get(positionController.list)


  app.route('/api/positions/:id')
  .get(positionController.find)
  .delete(positionController.delete)
  .patch(positionController.update)

  app.route('/api/candidates/')
  .post(candidateController.create)
  .get(candidateController.list)

  app.route('/api/candidates/:id/')
  .get(candidateController.find)
  .delete(candidateController.delete)
  .patch(candidateController.update)
  
  app.get('/api/candidates/:id/image/', candidateController.getImage)

  // Students
  app.route('/api/students/')
  .get(studentController.list)
  .post(studentController.create)

  app.post('/api/students/import/', studentController.import)
  app.get('/api/students.csv', studentController.export);

  app.route('/api/students/:id/')
  .delete(studentController.delete)
  .get(studentController.find)
  .patch(studentController.update)

  app.post('/api/students/:id/reset/', studentController.reset)

  // Teachers
  app.route('/api/teachers/')
  .get(teacherController.list)
  .post(teacherController.create)

  app.post('/api/teachers/import/', teacherController.import)
  app.get('/api/teachers.csv', teacherController.export);

  app.route('/api/teachers/:id/')
  .delete(teacherController.delete)
  .get(teacherController.find)
  .patch(teacherController.update)

  app.post('/api/teachers/:id/reset/', teacherController.reset)

}