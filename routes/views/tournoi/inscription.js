var keystone = require('keystone');
	Registration = keystone.list('Registration'),
	Tournament = keystone.list('Tournament'),
	_ = require('underscore'),
	async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

		// Init locals
	locals.filters = {
		idTournoi: req.params.idTournoi
	};

	view.on('render', function(next){
		Tournament.model.findOne({ _id: locals.filters.idTournoi }).exec(function(err, result) {
				locals.tournoi = result;
				next(err);
			});
	});

	view.render("tournoi/inscription");
}
