const {query, validValue} = require('../service');

class TownsService {
    async create(body) {
        body = await this.checkValue(body);
        const sql = `INSERT INTO points (town_id, name_uk, name_en, name_ru)
            VALUES ('${body.id}',
                    '${body.uk}',
                    '${body.en}',
                    '${body.ru}')`;
        return await query(sql)
            .then(() => "Town created!")
    }

    async edit(body) {
        body = await this.checkValue(body);
        const sql = `UPDATE points
            SET name_uk='${body.uk}',
                name_en='${body.en}',
                name_ru='${body.ru}'
            WHERE town_id='${body.id}'`;
        return await query(sql)
            .then(() => "Town updated!")
    }

    async delete(body, req) {
        const id = req.params["townid"];
        const sql = `DELETE a.*, b.*
            FROM points a
            LEFT JOIN transfers b
            ON a.town_id = b.transfer_from OR a.town_id = b.transfer_to
            WHERE a.town_id='${id}'`;
        return await query(sql)
            .then(() => "Town deleted!");
    }

    async open(body, req) {
        const id = req.params["townid"];
        const sql = `SELECT * FROM points WHERE town_id='${id}'`;
        return await query(sql)
            .then((result) => result);
    }

    async list() {
        const sql = `SELECT * FROM points`;
        return await query(sql)
            .then((result) => result);
    }
}

module.exports = new TownsService();