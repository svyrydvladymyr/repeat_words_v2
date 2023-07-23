const {query} = require('../service');

class SettingsService {
    colorlist = ['blue', 'green', 'red', 'yellow', 'grey'];
    langlist = ['uk-UA', 'pl-PL', 'it-IT', 'de-DE', 'es-ES', 'zh-CN'];
    voicelist = ['Google US English', 'Google UK English Female', 'Google UK English Male'];

    async validation(value) {
        if (!this.langlist.includes(value)) {
            throw new Error('Bad value!');
        };
    }

    async save(body) {

        console.log('body', body);

        const sql = `UPDATE settings
            SET ${body.route}='${body.value}'
            WHERE userid='${body.user}'`;
        return await query(sql)
            .then(() => "Settings updated!")
    }

    async localization(body) {

        return await this.save(body);
    }

    async language(body) {
        await this.validation(body.value);
        return await this.save(body);
    }

    // async delete(body, req) {
    //     const id = req.params["townid"];
    //     const sql = `DELETE a.*, b.*
    //         FROM points a
    //         LEFT JOIN transfers b
    //         ON a.town_id = b.transfer_from OR a.town_id = b.transfer_to
    //         WHERE a.town_id='${id}'`;
    //     return await query(sql)
    //         .then(() => "Town deleted!");
    // }

    // async open(body, req) {
    //     const id = req.params["townid"];
    //     const sql = `SELECT * FROM points WHERE town_id='${id}'`;
    //     return await query(sql)
    //         .then((result) => result);
    // }

    // async list() {
    //     const sql = `SELECT * FROM points`;
    //     return await query(sql)
    //         .then((result) => result);
    // }
}

module.exports = new SettingsService();