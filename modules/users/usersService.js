const fs = require('fs');
const { query, errorLog, userToken, date } = require("../service");
const settings = require("../settings/settingsService");

class UsersService {
    async langPack(page, lang) {
        const pack = (fs.existsSync(`./modules/lang/${lang}.js`))
            ? require(`../lang/${lang}`)
            : require(`../lang/uk-UA`);
        return {...pack['main'], ...pack[`${page}`]};
    };

    async addSettings(id) {
        const settings_sql = `INSERT INTO settings (userid) VALUES ('${id}')`;
        await query(settings_sql)
            .catch((error) => {
                if (error.code !== 'ER_DUP_ENTRY') {
                    errorLog(error, 'error', 'ERROR creating user settings record');
                };
            });
    }

    async createUser(profile) {
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

    async defaultUser(page, lang) {
        console.log(lang);
        const permission = {
            authorization : '0',
            rule : '0'
        };
        const user = {
            id : '',
            name : '',
            surname : '',
            foto : 'img/no_user.png',
            provider : '',
            registered : ''
        };
        const settings = {
            birthday : '',
            gender : '',
            localization : 'en-GB',
            email : '',
            emailverified : '',
            language : 'none',
            page : page || 'home',
            voice : 'Google UK English Female',
            speed : '1',
            pitch : '1',
            color : 'blue',
            langPack : await this.langPack(page, lang)
        };
        return {...permission, ...user, ...settings};
    };

    async getUser(req, res, page, lang) {

        console.log('page', page);
        const DATAS = await this.defaultUser(page, lang);
        const sql = `SELECT * FROM users
                    LEFT JOIN settings ON users.userid = settings.userid
                    WHERE users.token = '${userToken(req, res)}'`;
        return await query(sql)
            .then((user) => user[0])
            .then((user) => {

                console.log('user', user);

                if (!user) return DATAS;

                DATAS.rule = `${user.permission}`;
                DATAS.authorization = '1';
                DATAS.language = settings.langlist.includes(user.language) ? user.language : 'none';
                DATAS.localization = settings.langlist.includes(user.localization) ? user.localization : 'en-GB';
                DATAS.id = user.userid;
                DATAS.name = user.name;
                DATAS.surname = user.surname;
                DATAS.foto = user.ava;
                if (page === 'profile' || page === 'settings') {
                    DATAS.voice = settings.voicelist.includes(user.voice) ? user.voice : 'Google UK English Female';
                    DATAS.color = settings.colorlist.includes(user.color) ? user.color : 'blue';
                    DATAS.speed = user.speed;
                    DATAS.pitch = user.pitch;
                }
                if (page === 'profile') {
                    DATAS.email = user.email;
                    DATAS.emailverified = user.emailverified;
                    DATAS.birthday = user.birthday;
                    DATAS.gender = user.gender;
                    DATAS.provider = user.provider;
                    DATAS.registered = date.show('yyyy-mm-dd hh:mi', user.registered);
                }
                if (page === 'settings') {
                    DATAS.langlist = settings.langlist;
                    DATAS.voicelist = settings.voicelist;
                    DATAS.colorlist = settings.colorlist;
                }
                return DATAS;
            })
    };
}

module.exports = new UsersService();
