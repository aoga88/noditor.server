exports.index = function(req, res)
{
	res.render("app/index", req.session);
}

exports.profile = function(req, res)
{
	res.render("app/profile", req.session);
}