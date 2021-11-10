// import necessary models
const Post = require('../models/post');
const Comment = require('../models/comment');

const async = require('async');

exports.view_all = function(req, res, next) {
  Post.find({})
    .sort({createDate: -1})
    .exec(function(err, posts) {
      if (err) { return next(err); }
      res.render('user_allposts', { title: 'All Posts', posts: posts, user: req.user });
    });}

exports.newpost = function(req, res, next) {
  res.render('postform', { title: 'Create New Post', user: req.user });
}

exports.newpost_submit = function(req, res, next) {
  if (req.body.published == 'publish') {
    req.body.published = true
  } else {
    req.body.published = false
  }
  const post = new Post(
    {
      createDate: Date.now(),
      title: req.body.title,
      content: req.body.content,
      published: req.body.published
    }).save(function(err) {
      if (err) { return next(err); }
      res.redirect('/create/posts');
    })
  }

 
 exports.view_one = function(req, res, next) {
  async.parallel({
     
    post: function(callback) {
      Post.findById(req.params.id)
      .exec(callback)
    },
    comment: function(callback) {
      Comment.find({'post': req.params.id})
      .sort({createDate: -1})
      .exec(callback)
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.post==null) {
      const err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }
    res.render('user_onepost', { title: 'Post', post: results.post, comments: results.comment, user: req.user });
  });
}

exports.commentAction = async function(req, res, next) {
  if (req.body.commentID != null) {
    delete_comment(req, res, next);
  }
  else {
    const post = await Post.findById(req.params.id);

    const comment = new Comment(
      {
        name: req.body.name,
        content: req.body.content,
        post: post._id
    });

    comment.save(function(err) {
      if (err) { return next(err); }
      res.redirect(post.createUrl);
    })
  }
}

function delete_comment(req, res, next) {
  Comment.findByIdAndDelete(req.body.commentID, function (err) {
    if (err) { return next(err); }
    res.redirect('/create/posts/' + req.params.id);
  })
}

/* 
exports.comment = [
  body('name', 'Must provide a name').trim().isLength({min:1}).escape(),
  body('content', 'Cannot make a blank comment!').trim().isLength({min:1}).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const post = await Post.findById(req.params.id);

    const comment = new Comment(
      {
        name: req.body.name,
        content: req.body.content,
        post: post._id
    });

    if (!errors.isEmpty()) {
      res.render('reader_onepost', { title: 'Post', user: req.user , errors: errors.array()})
    }
    else {
      comment.save(function(err) {
        if (err) { return next(err); }
        res.redirect(post.createUrl);
      })
    }
  }
];
 */


exports.view_one_edit = function(req, res, next) {
  Post.findById(req.params.id).exec(function(err, results) {
    if (err) { return next(err); }
    console.log(results)
    res.render('postform', { title: 'Edit Post', post: results, user: req.user });
  });
}

exports.editAction = function(req, res, next) {
  if (req.body.deletePostID != null) {
    delete_post(req, res, next);
  }
  else {
    if (req.body.published == 'publish') {
      req.body.published = true
    } else {
      req.body.published = false
    }
    const post = new Post(
      {
        createDate: req.body.createDate,
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        _id: req.params.id
      });
      
    Post.findByIdAndUpdate(req.params.id, post, {}, function(err) {
        if (err) { return next(err); }
        res.redirect('/create/posts');
    });
  }
}

function delete_post(req, res, next) {
  Post.findByIdAndDelete(req.body.deletePostID, function (err) {
    if (err) { return next(err); }
    res.redirect('/create/posts/');
  })
}

/* 
exports.view_one_edit_submit = function(req, res, next) {
  if (req.body.published == 'publish') {
    req.body.published = true
  } else {
    req.body.published = false
  }
  const post = new Post(
    {
      createDate: req.body.createDate,
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      _id: req.params.id
    });
    
  Post.findByIdAndUpdate(req.params.id, post, {}, function(err) {
      if (err) { return next(err); }
      res.redirect('/create/posts');
  });
}
 */