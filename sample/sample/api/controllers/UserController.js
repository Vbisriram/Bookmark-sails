/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  // Returning the views from the controllers



  'new': function(req, res) {
    res.view();
  },

  'new1': function(req, res) {
    res.view();
  },

  'error': function(req, res) {
    res.view();
  },


  // Create function for the user in user collection in bookdb

  create: function(req, res, next) {


    var userObj = {
      name: req.param('username'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    }

    console.log(userObj);
    User.create(userObj, function userCreated(err, user) {

      if (err) {
        console.log(err);
        return res.redirect('/user/error');
      }
      req.session.authenticated = true;
      req.session.User = user;
      user.save(function(err, user) {
        if (err) return next(err);
        user.action = " signed-up and logged-in."
        res.redirect('/user/show/' + user.id);
      });
    });


  },

  creat: function(req, res, next) {

    var bcrypt = require('bcrypt');
    console.log("hiii");
    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      console.log("error 1");
      res.redirect('/user/new1');
      return;
    }

    // Try to find the user by there email address.
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    // User.findOneByEmail(req.param('email')).done(function(err, user) {
    User.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') +
            ' not found.'
        }]
        console.log("error 2");
        res.redirect('/user/new1');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword,
        function(err, valid) {
          if (err) return next(err);

          // If the password from the form doesn't match the password from the database...
          if (!valid) {
            var usernamePasswordMismatchError = [{
              name: 'usernamePasswordMismatch',
              message: 'Invalid username and password combination.'
            }]

            res.redirect('/user/new1');
            return;
          }

          // Log user in
          req.session.authenticated = true;
          req.session.User = user;

          //Redirect to their profile page (e.g. /views/user/show.ejs)
          res.redirect('/user/show/' + user.id);
        });
    });

  },
  // Shows the logged user information

  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },



  // check function for checking the logging in functionality using bcrypt package

  check: function(req, res, next) {

    var bcrypt = require('bcrypt');
    console.log("hiii");

    if (!req.param('email') || !req.param('password')) {

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      console.log(
        "Error Occurred ..You must enter both a username and password. ");
      res.redirect('/user/error');
      return;
    }



    User.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') +
            ' not found.'
        }]
        console.log("error 2");
        res.redirect('/user/new1');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword,
        function(err, valid) {
          if (err) return next(err);

          // If the password from the form doesn't match the password from the database...
          if (!valid) {
            var usernamePasswordMismatchError = [{
              name: 'usernamePasswordMismatch',
              message: 'Invalid username and password combination.'
            }]

            res.redirect('/user/new1');
            return;
          }

          // Log user in
          req.session.authenticated = true;
          req.session.User = user;

          //Redirect to their profile page (e.g. /views/user/show.ejs)
          res.redirect('/user/show/' + user.id);
        });
    });

  },

  edit: function(req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  update: function(req, res, next) {
    console.log("update");

    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email')
    }


    User.update(req.param('id'), userObj, function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    User.findOne(req.session.User.id, function foundUser(err, user) {

      var userId = req.session.User.id;


      req.session.destroy();

      // Redirect the browser to the sign-in screen
      res.redirect('#');


    });
  }

};
