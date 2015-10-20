var keystone = require('keystone'),
	Post = keystone.list('Post'),
    Team = keystone.list('Team'),
    Match = keystone.list('Match'),
	ffbadnews = require('../../lib/ffbadnews'),
    async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.query('articles', Post.model.find()
    .where('state', 'published')
    .populate('author')
    .populate('categories')
    .sort('-publishedDate')
    .limit(4));

    view.on('init', function(next) {
        Team.model.find()
        .sort('name')
        .exec(function(err, teams) {
            if(err){
                local.teams = [];
                return next(err);
            }else{
                locals.teams = teams;
                locals.matches = [];
                async.each(locals.teams,function(team, next){
                    Match.model.find()
                    .where('team').in([team._id])
                    .sort('matchNumber')
                    .exec(function(err, matches) {
                        locals.matches[team._id] = matches;
                        next(err);
                    });
                }, function(err) {
                    next(err);
                });
            }
        });
    });
	
	// Render the view
	view.render('newIndex');
	
};
