const settingsService = require("./settingsService");
const errorLog = require('../service').errorLog;

class SettingsController {
    async settings(req, res) {
        try {
            const url = req.url.split('/')[1].replace("/", "");
            req.body.route = url;
            req.body.user = req.user[0].userid;
            const query_res = await settingsService[`${url}`](req.body, req, res);
            res.send({ res: query_res });
        } catch (error) {
            errorLog(error, 'error', 'settings', req);
            res.status(400).send("400 (Bad Request)");
        }
    }
}

module.exports = new SettingsController();
