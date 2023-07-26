const Url = require('url-parse');
const errorLog = require('../service').errorLog;
const usersService = require('../users/usersService');
const pages_list = ['home', 'about', 'contacts', 'profile', 'settings', 'notification', 'friends', 'privacy-policy'];
const lang_list = ['uk-UA', 'pl-PL', 'it-IT', 'de-DE', 'es-ES', 'zh-CN', 'en-GB'];

class PagesController {
    async userData(req, res) {
        const path_name = Url(req.url, true).pathname.replace(/\//g, "");
        const page_name = pages_list.includes(path_name) ? path_name : "home";
        const lang = lang_list.includes(req.cookies ? req.cookies["lang"] : undefined) ? req.cookies["lang"] : "en-GB";

        console.log('pagename', page_name);
        console.log('pathname', path_name);
        console.log('lang', lang);

        await usersService.getUser(req, res, page_name, lang)
            .then((DATA) => {

                console.log('DATA', DATA);

                res.render(page_name, { DATA });
            })
            .catch(async (error) => {
                errorLog(error, 'error', 'pages', req);

                // console.log('defaultUser', usersService.defaultUser(pagename, lang));
                res.render(page_name, { DATA : await usersService.defaultUser(page_name, "en-GB") });
                // res.status(500).send("500 (Internal Server Error)");
            });


    }
}

module.exports = new PagesController();
