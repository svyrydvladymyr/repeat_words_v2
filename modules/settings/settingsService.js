const {query, errorLog} = require('../service');
const lists = {
    localization : ['en-GB', 'my'],
    color : ['blue', 'green', 'red', 'yellow', 'grey'],
    language : ['uk-UA', 'pl-PL', 'it-IT', 'de-DE', 'es-ES', 'zh-CN'],
    voice : ['Google US English', 'Google UK English Female', 'Google UK English Male']
}

class SettingsService {
    lists = lists;

    async validation(req, res, next) {
        const url = req.url.split('/')[1].replace("/", "");
        if (!lists[url].includes(req.body.value)) {
            errorLog('Bad value!', 'error', 'settings', req);
            res.status(400).send("400 (Bad Request)");
        } else {
            next();
        };
    }

    async save(body) {
        const sql = `UPDATE settings
            SET ${body.route}='${body.value}'
            WHERE userid='${body.user}'`;
        return await query(sql)
            .then(() => "Settings updated!")
    }

    localization = async (body) => await this.save(body);
    language = async (body) => await this.save(body);
    voice = async (body) => await this.save(body);
    color = async (body) => await this.save(body);
}

module.exports = new SettingsService();