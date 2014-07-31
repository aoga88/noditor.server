exports.login = function(req, res)
{
	if (typeof req.session.user === 'undefined') {
		res.render("layouts/login");
	}
}