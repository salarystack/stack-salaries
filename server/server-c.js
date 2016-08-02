'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _stackdata = require('./models/stackdata');

var _stackdata2 = _interopRequireDefault(_stackdata);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _secret = require('./secret');

var _secret2 = _interopRequireDefault(_secret);

var _passport = require('./passport/passport');

var _passport2 = _interopRequireDefault(_passport);

var _local = require('./passport/local');

var _local2 = _interopRequireDefault(_local);

var _github = require('./passport/github');

var _github2 = _interopRequireDefault(_github);

var _passport3 = require('passport');

var _passport4 = _interopRequireDefault(_passport3);

var _expressPassportLogout = require('express-passport-logout');

var _expressPassportLogout2 = _interopRequireDefault(_expressPassportLogout);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _expressMailer = require('express-mailer');

var _expressMailer2 = _interopRequireDefault(_expressMailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = require('./compiled/src/bundle').default;
var SD = require('./controllers/stackdataController');

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use(_express2.default.static(_path2.default.join(__dirname, '../client/compiled')));

// Mongoose Connection (Refactor into Separate File)
var databaseURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/stack-salaries';

_mongoose2.default.connect(databaseURL);

// Helper Methods (Refactor into Separate File)
function generateToken(user) {
  // Add issued at timestamp and subject
  // Based on the JWT convention
  var timestamp = new Date().getTime();
  return _jwtSimple2.default.encode({ sub: user.id, iat: timestamp }, _secret2.default.secret);
}

// Set to false since tokens are being used
// This is Passport Authentication setup
// Github auth will be added here as well
var requireAuth = _passport4.default.authenticate('jwt', { session: false });
var requireSignIn = _passport4.default.authenticate('local', { session: false });
var githubAuth = _passport4.default.authenticate('github', { session: false, successRedirect: '/', failureRedirect: '/login' });

// mailer.extend(app, {
//   from: 'stacksalary@gmail.com'
//   host: 'smtp.gmail.com', // hostname
//   secureConnection: true, // use SSL
//   port: 465, // port for secure SMTP
//   auth: {
//     user: 'stacksalary@gmail.com',
//     pass: 'mewtwo17'
//   }
// });

// Allow all headers
app.all('*', function (req, res, next) {

  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');

  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

//Search for any field
app.post('/search', function (req, res, next) {
  SD.querySalary(req.body, function (results) {
    res.json(results);
  });
});

// Add a Stack Entry
app.post('/stackentry', function (req, res, next) {
  SD.createSalary(req.body, function (result) {
    res.status(201);
    res.json(result);
  });
});

// GET all users
app.get('/users', requireAuth, function (req, res, next) {
  _user2.default.find({}, function (err, users) {
    if (!err) {
      res.send(200, users);
    } else {
      throw err;
    }
  });
});

app.get('/users/:id', function (req, res, next) {
  var id = req.params.id;

  // A friendly error to display if no user matches the id
  var err = "No such user with the given id";

  _user2.default.findOne({ id: id }, function (err, existingUser) {
    if (err) {
      res.send(err);
    } else {
      res.json(existingUser);
    }
  });
});

// The middleware will verify credentials
// If successful, hand a token
app.post('/signin', requireSignIn, function (req, res, next) {

  // Generate a token
  var token = generateToken(req.user);

  // Send user back a JWT upon successful account creation
  res.json({ user: req.user, token: token });
});

app.post('/signup', function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var gender = req.body.gender;

  // Validation to check if all the fields were being passed
  if (!email || !password || !name) {
    return res.send(422, { error: "Please fill out all the fields" });
  }

  // Check email already exists
  _user2.default.findOne({ email: email }, function (err, existingUser) {

    if (err) {
      return next(err);
    }

    // If it does, return "existing account" message
    if (existingUser) {
      // Return unprocessable entity
      return res.send(422, { error: 'Email is in use' });
    }

    // If not, create and save user
    var user = new _user2.default({
      name: name,
      email: email,
      password: password,
      gender: gender
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }

      // Generate a token
      var token = generateToken(user);

      // Send user back a JWT upon successful account creation
      res.json({ user: user, token: token });
    });
  });
});

// Log out a user
// Note, React Router is currently handling this
app.get('/logout', (0, _expressPassportLogout2.default)(), function (req, res, next) {
  res.redirect('/login');
});

// Root Path
app.get('*', function (req, res, next) {
  (0, _reactRouter.match)({ routes: routes, location: req.url }, function (error, redirectLocation, renderProps) {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).send((0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, renderProps)));
    } else {
      res.status(404).send('Not found');
    }
  });
});

// app.get('/api/contact', function (req, res) {
//   app.mailer.send('email', {
//     to: 'stacksalary@gmail.com',
//     subject: 'Question',
//     text: 'something'
//   }, function (err) {
//     if (err) {
//       console.log(err);
//       res.send('There was an error sending the meail');
//     }
//     res.send('Email Sent!');
//   });
// });

var port = process.env.PORT || 3000;

app.listen(port);
console.log('Server now listening on port ' + port);

module.exports = app;

//# sourceMappingURL=data:application/json;base64,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QUFoQixDQUFxQixNQUFNLE9BQTNCO0FBQ0QsS0FGRCxNQUVPLElBQUksZ0JBQUosRUFBc0I7QUFDM0IsVUFBSSxRQUFKLENBQWEsR0FBYixFQUFrQixpQkFBaUIsUUFBakIsR0FBNEIsaUJBQWlCLE1BQS9EO0FBQ0QsS0FGTSxNQUVBLElBQUksV0FBSixFQUFpQjs7OztBQUl0QixVQUFJLE1BQUosQ0FBVyxHQUFYLEVBQWdCLElBQWhCLENBQXFCLDRCQUFlLDBEQUFtQixXQUFuQixDQUFmLENBQXJCO0FBQ0QsS0FMTSxNQUtBO0FBQ0wsVUFBSSxNQUFKLENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFxQixXQUFyQjtBQUNEO0FBQ0YsR0FiRDtBQWNELENBZkQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkEsSUFBSSxPQUFPLFFBQVEsR0FBUixDQUFZLElBQVosSUFBb0IsSUFBL0I7O0FBRUEsSUFBSSxNQUFKLENBQVcsSUFBWDtBQUNBLFFBQVEsR0FBUixDQUFZLGtDQUFrQyxJQUE5Qzs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsR0FBakIiLCJmaWxlIjoic2VydmVyLWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBtb3JnYW4gZnJvbSAnbW9yZ2FuJztcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5pbXBvcnQgVXNlciBmcm9tICcuL21vZGVscy91c2VyJztcbmltcG9ydCBTdGFja0RhdGEgZnJvbSAnLi9tb2RlbHMvc3RhY2tkYXRhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdC1ub2RlanMnO1xuaW1wb3J0IGp3dCBmcm9tICdqd3Qtc2ltcGxlJztcbmltcG9ydCBzZWNyZXQgZnJvbSAnLi9zZWNyZXQnO1xuaW1wb3J0IHBhc3Nwb3J0QXV0aCBmcm9tICcuL3Bhc3Nwb3J0L3Bhc3Nwb3J0JztcbmltcG9ydCBsb2NhbEF1dGggZnJvbSAnLi9wYXNzcG9ydC9sb2NhbCc7XG5pbXBvcnQgZ2l0aHViIGZyb20gJy4vcGFzc3BvcnQvZ2l0aHViJztcbmltcG9ydCBwYXNzcG9ydCBmcm9tICdwYXNzcG9ydCc7XG5pbXBvcnQgbG9nb3V0IGZyb20gJ2V4cHJlc3MtcGFzc3BvcnQtbG9nb3V0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuaW1wb3J0IHsgbWF0Y2gsIFJvdXRlckNvbnRleHQgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xuaW1wb3J0IG1haWxlciBmcm9tICdleHByZXNzLW1haWxlcic7XG5cbnZhciByb3V0ZXMgPSByZXF1aXJlKCcuL2NvbXBpbGVkL3NyYy9idW5kbGUnKS5kZWZhdWx0O1xudmFyIFNEID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy9zdGFja2RhdGFDb250cm9sbGVyJyk7XG5cbnZhciBhcHAgPSBleHByZXNzKCk7XG5cbmFwcC51c2UobW9yZ2FuKCdkZXYnKSk7XG5hcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuYXBwLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vY2xpZW50L2NvbXBpbGVkJykpKTtcblxuXG4vLyBNb25nb29zZSBDb25uZWN0aW9uIChSZWZhY3RvciBpbnRvIFNlcGFyYXRlIEZpbGUpXG52YXIgZGF0YWJhc2VVUkwgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSB8fCdtb25nb2RiOi8vbG9jYWxob3N0OjI3MDE3L3N0YWNrLXNhbGFyaWVzJ1xuXG5tb25nb29zZS5jb25uZWN0KGRhdGFiYXNlVVJMKTtcblxuLy8gSGVscGVyIE1ldGhvZHMgKFJlZmFjdG9yIGludG8gU2VwYXJhdGUgRmlsZSlcbmZ1bmN0aW9uIGdlbmVyYXRlVG9rZW4odXNlcil7XG4gIC8vIEFkZCBpc3N1ZWQgYXQgdGltZXN0YW1wIGFuZCBzdWJqZWN0XG4gIC8vIEJhc2VkIG9uIHRoZSBKV1QgY29udmVudGlvblxuICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHJldHVybiBqd3QuZW5jb2RlKHsgc3ViOiB1c2VyLmlkLCBpYXQ6IHRpbWVzdGFtcCB9LCBzZWNyZXQuc2VjcmV0KTtcbn1cblxuLy8gU2V0IHRvIGZhbHNlIHNpbmNlIHRva2VucyBhcmUgYmVpbmcgdXNlZFxuLy8gVGhpcyBpcyBQYXNzcG9ydCBBdXRoZW50aWNhdGlvbiBzZXR1cFxuLy8gR2l0aHViIGF1dGggd2lsbCBiZSBhZGRlZCBoZXJlIGFzIHdlbGxcbnZhciByZXF1aXJlQXV0aCA9IHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnand0JywgeyBzZXNzaW9uOiBmYWxzZSB9ICk7XG52YXIgcmVxdWlyZVNpZ25JbiA9IHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnbG9jYWwnLCB7IHNlc3Npb246IGZhbHNlIH0pO1xudmFyIGdpdGh1YkF1dGggPSBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2dpdGh1YicsIHsgc2Vzc2lvbjogZmFsc2UsIHN1Y2Nlc3NSZWRpcmVjdDogJy8nLCBmYWlsdXJlUmVkaXJlY3Q6ICcvbG9naW4nfSk7XG5cbi8vIG1haWxlci5leHRlbmQoYXBwLCB7XG4vLyAgIGZyb206ICdzdGFja3NhbGFyeUBnbWFpbC5jb20nXG4vLyAgIGhvc3Q6ICdzbXRwLmdtYWlsLmNvbScsIC8vIGhvc3RuYW1lXG4vLyAgIHNlY3VyZUNvbm5lY3Rpb246IHRydWUsIC8vIHVzZSBTU0xcbi8vICAgcG9ydDogNDY1LCAvLyBwb3J0IGZvciBzZWN1cmUgU01UUFxuLy8gICBhdXRoOiB7XG4vLyAgICAgdXNlcjogJ3N0YWNrc2FsYXJ5QGdtYWlsLmNvbScsXG4vLyAgICAgcGFzczogJ21ld3R3bzE3J1xuLy8gICB9XG4vLyB9KTtcblxuLy8gQWxsb3cgYWxsIGhlYWRlcnNcbmFwcC5hbGwoJyonLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge+KAqFxuICByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nLCAnKicpO+KAqFxuICByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ1BVVCwgR0VULCBQT1NULCBERUxFVEUnKTvigKhcbiAgcmVzLmhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycycsICdDb250ZW50LVR5cGUnKTvigKhcbiAgbmV4dCgpO+KAqFxufSk7XG5cbi8vU2VhcmNoIGZvciBhbnkgZmllbGRcbmFwcC5wb3N0KCcvc2VhcmNoJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgU0QucXVlcnlTYWxhcnkocmVxLmJvZHksIGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICByZXMuanNvbihyZXN1bHRzKTtcbiAgfSk7XG59KTtcblxuLy8gQWRkIGEgU3RhY2sgRW50cnlcbmFwcC5wb3N0KCcvc3RhY2tlbnRyeScsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFNELmNyZWF0ZVNhbGFyeShyZXEuYm9keSwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmVzLnN0YXR1cygyMDEpO1xuICAgIHJlcy5qc29uKHJlc3VsdCk7XG4gIH0pO1xufSk7XG5cbi8vIEdFVCBhbGwgdXNlcnNcbmFwcC5nZXQoJy91c2VycycsIHJlcXVpcmVBdXRoLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICBVc2VyLmZpbmQoe30sIGZ1bmN0aW9uKGVyciwgdXNlcnMpIHtcbiAgICBpZighZXJyKSB7XG4gICAgICByZXMuc2VuZCgyMDAsIHVzZXJzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgfSk7XG59KTtcblxuYXBwLmdldCgnL3VzZXJzLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBpZCA9IHJlcS5wYXJhbXMuaWQ7XG5cbiAgLy8gQSBmcmllbmRseSBlcnJvciB0byBkaXNwbGF5IGlmIG5vIHVzZXIgbWF0Y2hlcyB0aGUgaWRcbiAgdmFyIGVyciA9IFwiTm8gc3VjaCB1c2VyIHdpdGggdGhlIGdpdmVuIGlkXCI7XG5cbiAgIFVzZXIuZmluZE9uZSh7IGlkOiBpZH0sIGZ1bmN0aW9uKGVyciwgZXhpc3RpbmdVc2VyKSB7XG4gICAgaWYoZXJyKSB7XG4gICAgICByZXMuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuanNvbihleGlzdGluZ1VzZXIpO1xuICAgIH1cbiAgIH0pO1xufSk7XG5cbi8vIFRoZSBtaWRkbGV3YXJlIHdpbGwgdmVyaWZ5IGNyZWRlbnRpYWxzXG4vLyBJZiBzdWNjZXNzZnVsLCBoYW5kIGEgdG9rZW5cbmFwcC5wb3N0KCcvc2lnbmluJywgcmVxdWlyZVNpZ25JbiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcblxuICAvLyBHZW5lcmF0ZSBhIHRva2VuXG4gIHZhciB0b2tlbiA9IGdlbmVyYXRlVG9rZW4ocmVxLnVzZXIpO1xuXG4gIC8vIFNlbmQgdXNlciBiYWNrIGEgSldUIHVwb24gc3VjY2Vzc2Z1bCBhY2NvdW50IGNyZWF0aW9uXG4gIHJlcy5qc29uKHt1c2VyOiByZXEudXNlciwgdG9rZW46IHRva2VufSk7XG59KTtcblxuYXBwLnBvc3QoJy9zaWdudXAnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgbmFtZSA9IHJlcS5ib2R5Lm5hbWU7XG4gIHZhciBlbWFpbCA9IHJlcS5ib2R5LmVtYWlsO1xuICB2YXIgcGFzc3dvcmQgPSByZXEuYm9keS5wYXNzd29yZDtcbiAgdmFyIGdlbmRlciA9IHJlcS5ib2R5LmdlbmRlcjtcblxuICAvLyBWYWxpZGF0aW9uIHRvIGNoZWNrIGlmIGFsbCB0aGUgZmllbGRzIHdlcmUgYmVpbmcgcGFzc2VkXG4gIGlmKCFlbWFpbCB8fCAhcGFzc3dvcmQgfHwgIW5hbWUpe1xuICAgIHJldHVybiByZXMuc2VuZCg0MjIsIHtlcnJvcjogXCJQbGVhc2UgZmlsbCBvdXQgYWxsIHRoZSBmaWVsZHNcIn0pO1xuICB9XG5cbiAgLy8gQ2hlY2sgZW1haWwgYWxyZWFkeSBleGlzdHNcbiAgVXNlci5maW5kT25lKHsgZW1haWw6IGVtYWlsfSwgZnVuY3Rpb24oZXJyLCBleGlzdGluZ1VzZXIpIHtcblxuICAgIGlmKGVycikgeyByZXR1cm4gbmV4dChlcnIpOyB9XG5cbiAgICAvLyBJZiBpdCBkb2VzLCByZXR1cm4gXCJleGlzdGluZyBhY2NvdW50XCIgbWVzc2FnZVxuICAgIGlmKGV4aXN0aW5nVXNlcil7XG4gICAgICAvLyBSZXR1cm4gdW5wcm9jZXNzYWJsZSBlbnRpdHlcbiAgICAgIHJldHVybiByZXMuc2VuZCg0MjIsIHsgZXJyb3I6ICdFbWFpbCBpcyBpbiB1c2UnIH0pO1xuICAgIH1cblxuICAgIC8vIElmIG5vdCwgY3JlYXRlIGFuZCBzYXZlIHVzZXJcbiAgICB2YXIgdXNlciA9IG5ldyBVc2VyKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBlbWFpbDogZW1haWwsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICBnZW5kZXI6IGdlbmRlclxuICAgIH0pO1xuXG4gICAgdXNlci5zYXZlKGZ1bmN0aW9uKGVycil7XG4gICAgICBpZiAoZXJyKSB7IHJldHVybiBuZXh0KGVycik7IH1cblxuICAgICAgLy8gR2VuZXJhdGUgYSB0b2tlblxuICAgICAgdmFyIHRva2VuID0gZ2VuZXJhdGVUb2tlbih1c2VyKTtcblxuICAgICAgLy8gU2VuZCB1c2VyIGJhY2sgYSBKV1QgdXBvbiBzdWNjZXNzZnVsIGFjY291bnQgY3JlYXRpb25cbiAgICAgIHJlcy5qc29uKHt1c2VyOiB1c2VyLCB0b2tlbjogdG9rZW59KTtcbiAgICB9KTtcblxuICB9KTtcblxufSk7XG5cbi8vIExvZyBvdXQgYSB1c2VyXG4vLyBOb3RlLCBSZWFjdCBSb3V0ZXIgaXMgY3VycmVudGx5IGhhbmRsaW5nIHRoaXNcbmFwcC5nZXQoJy9sb2dvdXQnLCBsb2dvdXQoKSwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpe1xuICByZXMucmVkaXJlY3QoJy9sb2dpbicpO1xufSk7XG5cbi8vIFJvb3QgUGF0aFxuYXBwLmdldCgnKicsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIG1hdGNoKHsgcm91dGVzLCBsb2NhdGlvbjogcmVxLnVybCB9LCAoZXJyb3IsIHJlZGlyZWN0TG9jYXRpb24sIHJlbmRlclByb3BzKSA9PiB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnJvci5tZXNzYWdlKVxuICAgIH0gZWxzZSBpZiAocmVkaXJlY3RMb2NhdGlvbikge1xuICAgICAgcmVzLnJlZGlyZWN0KDMwMiwgcmVkaXJlY3RMb2NhdGlvbi5wYXRobmFtZSArIHJlZGlyZWN0TG9jYXRpb24uc2VhcmNoKVxuICAgIH0gZWxzZSBpZiAocmVuZGVyUHJvcHMpIHtcbiAgICAgIC8vIFlvdSBjYW4gYWxzbyBjaGVjayByZW5kZXJQcm9wcy5jb21wb25lbnRzIG9yIHJlbmRlclByb3BzLnJvdXRlcyBmb3JcbiAgICAgIC8vIHlvdXIgXCJub3QgZm91bmRcIiBjb21wb25lbnQgb3Igcm91dGUgcmVzcGVjdGl2ZWx5LCBhbmQgc2VuZCBhIDQwNCBhc1xuICAgICAgLy8gYmVsb3csIGlmIHlvdSdyZSB1c2luZyBhIGNhdGNoLWFsbCByb3V0ZS5cbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlbmRlclRvU3RyaW5nKDxSb3V0ZXJDb250ZXh0IHsuLi5yZW5kZXJQcm9wc30gLz4pKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnTm90IGZvdW5kJylcbiAgICB9XG4gIH0pXG59KTtcblxuLy8gYXBwLmdldCgnL2FwaS9jb250YWN0JywgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4vLyAgIGFwcC5tYWlsZXIuc2VuZCgnZW1haWwnLCB7XG4vLyAgICAgdG86ICdzdGFja3NhbGFyeUBnbWFpbC5jb20nLFxuLy8gICAgIHN1YmplY3Q6ICdRdWVzdGlvbicsXG4vLyAgICAgdGV4dDogJ3NvbWV0aGluZydcbi8vICAgfSwgZnVuY3Rpb24gKGVycikge1xuLy8gICAgIGlmIChlcnIpIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgICAgICByZXMuc2VuZCgnVGhlcmUgd2FzIGFuIGVycm9yIHNlbmRpbmcgdGhlIG1lYWlsJyk7XG4vLyAgICAgfVxuLy8gICAgIHJlcy5zZW5kKCdFbWFpbCBTZW50IScpO1xuLy8gICB9KTtcbi8vIH0pO1xuXG52YXIgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuYXBwLmxpc3Rlbihwb3J0KTtcbmNvbnNvbGUubG9nKCdTZXJ2ZXIgbm93IGxpc3RlbmluZyBvbiBwb3J0ICcgKyBwb3J0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7Il19