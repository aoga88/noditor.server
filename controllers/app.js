exports.index = function(req, res)
{
	res.render("app/index", req.session);
}

exports.profile = function(req, res)
{
	res.render("app/profile/index", req.session);
}

exports.changePassword = function(req, res)
{
	res.render("app/profile/change-password", req.session);
}