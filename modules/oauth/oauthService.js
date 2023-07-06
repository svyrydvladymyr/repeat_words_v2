const { token, query, addCookies, errorLog, date } = require("../service");

class OauthService {
    async createUser(profile) {
        // const date = new Date();
        return {
            id: profile.id,
            provider: profile.provider,
            firstName: profile.name && profile.name.givenName ? profile.name.givenName : "",
            lastName: profile.name && profile.name.familyName ? profile.name.familyName : "",
            email: profile.emails && profile.emails.length > 0 && profile.emails[0].value !== undefined ? profile.emails[0].value : "",
            photo: profile.photos && profile.photos.length > 0 && profile.photos[0].value !== undefined ? profile.photos[0].value : "",
            date: date.show('yyyy-mm-dd hh:mi'),
        };
    }

    async updateToken(req, res, user_id) {
        const token_id = token(20);
        const sql = `UPDATE users SET token = '${token_id}' WHERE userid = '${user_id}'`;
        await query(sql)
            .then(() => {
                addCookies(req, res, token_id, "");
                res.redirect("/home");
            })
            .catch((error) => {
                errorLog(error, 'error', 'ERROR update token');
                addCookies(req, res, "", "-1");
                res.redirect("/home");
            });
    }

    async addSettings(id) {
        const settings_sql = `INSERT INTO settings (userid) VALUES ('${id}')`;
        await query(settings_sql)
            .catch((error) => {
                if (error.code !== 'ER_DUP_ENTRY') {
                    errorLog(error, 'error', 'ERROR creating user settings record');
                };
            });
    }

    async addUser(profile, done) {
        const user = await this.createUser(profile);
        const sql = `INSERT INTO users (userid, name, surname, provider, email, registered, ava)
                   VALUES ('${user.id}',
                   '${user.firstName}',
                   '${user.lastName}',
                   '${user.provider}',
                   '${user.email}',
                   '${user.date}',
                   '${user.photo}')`;
        await query(sql)
            .then(() => done(null, profile))
            .catch((error) => done(`ERROR creating user: ${error}`, null));
        await this.addSettings(user.id);
    }

    async isUser(profile, done) {
        const user = await this.createUser(profile);
        const sql = `UPDATE users SET
                name = '${user.firstName}',
                surname = '${user.lastName}',
                email = '${user.email}',
                ava = '${user.photo}'
            WHERE userid = '${user.id}'`;  
        await query(sql)
            .then(() => done(null, profile))
            .catch((error) => {
                errorLog(error, 'error', 'ERROR updating user');
                done(null, profile);
            });
        await this.addSettings(user.id);
    }

    logOut(req, res) {
        addCookies(req, res, "", "-1");
        res.redirect("/");
    }
}

module.exports = new OauthService();
