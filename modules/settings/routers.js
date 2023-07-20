const Router = require('express');
const settingsRouter = new Router;
const settings = require('./settingsController');
const autorisation = require('../service').autorisation;

settingsRouter.use(autorisation);
settingsRouter.post('/localization', settings.settings);
settingsRouter.post('/language', settings.settings);
settingsRouter.post('/color', settings.settings);
settingsRouter.post('/voice', settings.settings);
settingsRouter.post('/speed', settings.settings);
settingsRouter.post('/pitch', settings.settings);


module.exports = settingsRouter;