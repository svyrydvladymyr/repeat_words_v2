const {query, errorLog} = require('../service');
const lists = {
    localization : ['en-GB', 'my'],
    color : ['blue', 'green', 'red', 'yellow', 'grey'],
    language : ['uk-UA', 'pl-PL', 'it-IT', 'de-DE', 'es-ES', 'zh-CN'],
    voice : ['Google US English', 'Google UK English Female', 'Google UK English Male'],
    speed : ['0.5', '0.6', '0.7', '0.8', '0.9', '1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2'],
    pitch : ['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2'],
    pages : ['home', 'about', 'contacts', 'profile', 'settings', 'notification', 'friends', 'privacy-policy', 'repeat', 'search', 'lists']
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
    speed = async (body) => await this.save(body);
    pitch = async (body) => await this.save(body);
}

module.exports = new SettingsService();