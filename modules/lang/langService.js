const fs = require('fs');

class LangService {
    lang_alias = {
        "en-GB" : "English",
        "uk-UA" : "Українська",
        "pl-PL" : "Polski",
        "it-IT" : "Italiano",
        "de-DE" : "Deutsch",
        "es-ES" : "Español",
        "zh-CN" : "中国人",
    };

    async langPack(page, lang) {
        const pack = (fs.existsSync(`./modules/lang/${lang}.js`))
            ? require(`../lang/${lang}`)
            : require(`../lang/en-GB`);
        return {
            ...pack['main'],
            ...pack['message'],
            ...pack[`${page}`]
        };
    };
    async formFields(page, lang) {
        const pack = (fs.existsSync(`./modules/lang/${lang}.js`))
            ? require(`../lang/${lang}`)
            : require(`../lang/en-GB`);
        return {
            ...pack.form[`main`],
            ...pack.form[`${page}`]
        };
    };
}

module.exports = new LangService();
