const express = require('express');
const positionController = require('./controllers/position');
const candidateController = require('./controllers/candidate');
const studentController = require('./controllers/student');

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

  app.route('/api/students/')
  .get(studentController.list)
}