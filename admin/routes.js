const express = require('express');
const positionController = require('./controllers/position');
const candidateController = require('./controllers/candidate');
const studentController = require('./controllers/student');
const teacherController = require('./controllers/teacher');
const managementController = require('./controllers/management');
const optionsController = require('./controllers/options');

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

  // Management
  app.route('/api/management/')
  .get(managementController.list)
  .post(managementController.create)

  app.post('/api/management/import/', managementController.import)
  app.get('/api/management.csv', managementController.export);

  app.route('/api/management/:id/')
  .delete(managementController.delete)
  .get(managementController.find)
  .patch(managementController.update)

  app.post('/api/management/:id/reset/', managementController.reset)

  app.get('/api/stats/', optionsController.stats);
  app.get('/api/options/:key/', optionsController.get);
  app.post('/api/options/:key/', optionsController.set);
}