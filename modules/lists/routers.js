const Router = require('express');
const listsRouter = new Router;
const lists = require('./listsController');
const autorisation = require('../service').autorisation;

listsRouter.use(autorisation);
listsRouter.post('/create', lists.lists);
listsRouter.put('/edit', lists.lists);
listsRouter.delete('/delete/:listid$', lists.lists);
listsRouter.get('/info/:listid$', lists.lists);

module.exports = listsRouter;