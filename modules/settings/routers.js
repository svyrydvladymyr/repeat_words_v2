const Router = require('express');
const settingsRouter = new Router;
const settings = require('./settingsController');
const validation = require('./settingsService').validation;
const autorisation = require('../service').autorisation;

settingsRouter.use(autorisation);
settingsRouter.post('/localization', validation, settings.settings);
settingsRouter.post('/language', validation, settings.settings);
settingsRouter.post('/color', validation, settings.settings);
settingsRouter.post('/voice', validation, settings.settings);
settingsRouter.post('/speed', validation, settings.settings);
settingsRouter.post('/pitch', validation, settings.settings);


module.exports = settingsRouter;