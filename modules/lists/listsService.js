const {query, token, date} = require('../service');
const list_types = ['list', 'courses'];
const list_permissions = ['public', 'private', 'global', 'friends'];

class ListsService {
    async owner(body, req) {
        query(`SELECT created_by FROM lists WHERE listid = '${body.listid}'`)
        .then((user) => {
            if (req.user[0].userid === user[0].created_by) {
                return true;
            } else {
                throw new Error('Bad permission!');
            };
        });
    }

    async create(body) {
        const sql = `INSERT INTO lists (listid, list, list_type, list_permission, created_by, created_date) VALUES (
            '${token(8)}',
            '${body.name}',
            '${list_types.includes(body.type) ? body.type : 'list'}',
            '${list_permissions.includes(body.permission) ? body.permission : 'private'}',
            '${body.user}',
            '${date.show("hh:mi dd.mm.yyyy")}')`;
        return await query(sql)
            .then(() => "Lists created!")
    }

    async edit(body) {
        await owner(body, req);
        const sql = `UPDATE lists SET
                list = '${body.name}',
                list_type = '${list_types.includes(body.type) ? body.type : 'list'}',
                list_permission = '${list_permissions.includes(body.permission) ? body.permission : 'private'}'
                created_date = '${date.show("hh:mi dd.mm.yyyy")}'
            WHERE listid = '${body.listid}'`;
        return await query(sql)
            .then(() => "Lists updated!")
    }

    async delete(body, req) {
        await owner(body, req);
        const id = req.params["listid"];
        const sql = `DELETE FROM lists WHERE listid='${id}'`;
        return await query(sql)
            .then(() => "Lists deleted!");
    }

    async info(body, req) {
        const id = req.params["listid"];
        const sql = `SELECT * FROM lists WHERE listid = '${id}'`;
        return await query(sql)
            .then((result) => result);
    }
}

module.exports = new ListsService();