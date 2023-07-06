const fs = require('fs');
const {query, userToken, date} = require('../service');

class Users {
    async langPack(page, lang) {
        const pack = (fs.existsSync(`./modules/lang/${lang}.js`)) ? require(`../lang/${lang}`) : require(`../lang/uk-UA`);
        return {...pack['main'], ...pack[`${page}`]};
    };

    async defaultUser(page, lang) {
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
            localization : '',
            email : '',
            emailverified : '',
            language : lang || 'uk-UA',
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
                DATAS.language = user.language;
                DATAS.localization = user.localization;
                DATAS.id = user.userid;
                DATAS.name = user.name;
                DATAS.surname = user.surname;
                DATAS.foto = user.ava;
                if (page === 'profile' || page === 'settings') {
                    DATAS.voice = user.voice;
                    DATAS.speed = user.speed;
                    DATAS.pitch = user.pitch;
                    DATAS.color = user.color;
                }
                if (page === 'profile') {
                    DATAS.email = user.email;
                    DATAS.emailverified = user.emailverified;
                    DATAS.birthday = user.birthday;
                    DATAS.gender = user.gender;
                    DATAS.provider = user.provider;
                    DATAS.registered = date.show('yyyy-mm-dd hh:mi', user.registered);
                }
                return DATAS;
            })
    };
};

module.exports = new Users();