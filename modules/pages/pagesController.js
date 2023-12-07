const Url = require('url-parse');
const errorLog = require('../service').errorLog;
const usersService = require('../users/usersService');
const langService = require("../lang/langService");
const settings = require("../settings/settingsService");

class PagesController {
    async userData(req, res) {
        let DATA;
        const path_name = Url(req.url, true).pathname.replace(/\//g, "");
        const page_name = settings.lists.pages.includes(path_name) ? path_name : "home";
        // const not_authorized_lang = settings.lists.language.includes(req.cookies ? req.cookies["lang"] : undefined) ? req.cookies["lang"] : "none";
        // console.log('pagename', page_name);
        // console.log('pathname', path_name);
        // console.log('not_authorized_lang', not_authorized_lang);
        await usersService.getUser(req, res, page_name)
            .then((USER) => {
                console.log("USER", USER);
                DATA = USER;
            })
            .catch(async (error) => {
                errorLog(error, 'error', 'pages', req);
                DATA = await usersService.defaultUser(page_name);
            })
            .finally(async () => {
                const lang = settings.lists.language.includes(DATA.language) ? DATA.language : 'en-GB';
                DATA.langPack = await langService.langPack(page_name, DATA.localization === 'my' ? lang : 'en-GB');
                DATA.localization = (DATA.language === 'none') ? 'en-GB' : DATA.localization;
                // console.log("DATA", DATA);
                res.render(page_name, { DATA : DATA});
            });
    };
}

module.exports = new PagesController();
