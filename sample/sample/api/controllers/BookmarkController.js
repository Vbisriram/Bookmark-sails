/**
 * BookmarkController
 *
 * @description :: Server-side logic for managing bookmarks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  'registered': function(req, res) {
    res.view();
  },

  'register': function(req, res) {
    res.view();
  },

  create: function(req, res, next) {

    var user_id = req.param('user_id');

    var bookObj = {
      title: req.param('title'),
      url: req.param('url'),
      category_id: req.param('category_id')
    }

    console.log(bookObj);

    Bookmark.create(bookObj, function bookmarkCreated(err, user) {

      if (err) {
        console.log(err);
        return res.redirect('/user/error');
      }
      res.redirect('/user/show/' + user_id);

    });


  }

};
