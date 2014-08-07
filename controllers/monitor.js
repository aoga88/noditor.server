exports.index = function(req, res) {
	res.render('app/monitor/index', req.session);
}