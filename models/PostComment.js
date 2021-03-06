var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Posts
	=====
 */

var PostComment = new keystone.List('PostComment', {
	label: 'Commentaires'
});

PostComment.add({
	author: { type: Types.Relationship, initial: true, ref: 'User', label:'Auteur', index: true },
	post: { type: Types.Relationship, initial: true, ref: 'Post', label:'Actualités', index: true },
	commentState: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', label:'Etat', index: true },
	publishedOn: { type: Types.Date, default: Date.now, label:'Date de publication', noedit: true, index: true }
});

PostComment.add('Content', {
	content: { type: Types.Html, label:'Message', wysiwyg: true, height: 300 }
});

PostComment.hasRoles = function(user){
	if(user) {
		return user.isAdmin;
	}
	return false;
};

PostComment.schema.pre('save', function (next) {
	if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState === 'published') {
		this.publishedOn = new Date();
	}
	next();
});

PostComment.track = true;
PostComment.defaultSort = '-post';
PostComment.defaultColumns = 'author, post, publishedOn, commentState';
PostComment.register();
