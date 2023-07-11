const { token, query, addCookies, errorLog } = require("../service");

class OauthService {
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

    logOut(req, res) {
        addCookies(req, res, "", "-1");
        res.redirect("/");
    }
}

module.exports = new OauthService();
