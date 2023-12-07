const { query, errorLog, userToken, date } = require("../service");
const settings = require("../settings/settingsService");
const langService = require("../lang/langService");

class UsersService {
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

    async defaultUser(page) {
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
            langname : '',
            page : page || 'home',
            voice : 'Google UK English Female',
            speed : '1',
            pitch : '1',
            color : 'blue'
        };
        const lists = {
            langlist : [],
            voicelist : [],
            colorlist : []
        };
        return {...permission, ...user, ...settings, ...lists};
    };

    async getUser(req, res, page) {
        // console.log('page', page);
        const USER = await this.defaultUser(page);
        const sql = `SELECT * FROM users
                    LEFT JOIN settings ON users.userid = settings.userid
                    WHERE users.token = '${userToken(req, res)}'`;
        return await query(sql)
            .then((user) => user[0])
            .then(async (user) => {
                console.log('user', user);
                (!user) && USER;
                USER.rule = `${user.permission}`;
                USER.authorization = '1';
                USER.language = settings.lists.language.includes(user.language) ? user.language : 'none';
                USER.localization = user.localization === 'my' ? 'my' : 'en-GB';
                USER.id = user.userid;
                USER.name = user.name;
                USER.surname = user.surname;
                USER.foto = user.ava;
                USER.color = settings.lists.color.includes(user.color) ? user.color : 'blue';
                USER.voice = settings.lists.voice.includes(user.voice) ? user.voice : 'Google UK English Female';
                USER.speed = user.speed;
                USER.pitch = user.pitch;
                USER.form = JSON.stringify(await langService.formFields(page, USER.language));
                if (USER.language === 'none') {
                    USER.langlist = settings.lists.language;
                }
                if (page === 'profile') {
                    USER.langname = langService.lang_alias[`${USER.language}`];
                    USER.email = user.email;
                    USER.emailverified = user.emailverified;
                    USER.birthday = user.birthday;
                    USER.gender = user.gender;
                    USER.provider = user.provider;
                    USER.registered = date.show('yyyy-mm-dd hh:mi', user.registered);
                }
                if (page === 'settings') {
                    USER.langlist = settings.lists.language;
                    USER.voicelist = settings.lists.voice;
                    USER.colorlist = settings.lists.color;
                }
                return USER;
            })
    };
}

module.exports = new UsersService();
