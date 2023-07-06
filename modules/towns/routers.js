const Router = require('express');
const townsRouter = new Router;
const towns = require('./townsController');
const {autorisation, permission} = require('../service');

townsRouter.use(autorisation, permission);
townsRouter.post('/create', towns.town);
townsRouter.put('/edit', towns.town);
townsRouter.get('/open/:townid$', towns.town);

module.exports = townsRouter;