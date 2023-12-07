const listsService = require("./listsService");
const errorLog = require('../service').errorLog;

class ListsController {
    async lists(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            req.body.route = url;
            req.body.user = req.user[0].userid;
            const query_res = await listsService[`${url}`](req.body, req, res);
            res.send({ res: query_res });
        } catch (error) {

            console.log('listerrrooorrr', error);

            errorLog(error, 'error', 'lists', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new ListsController();
