'use strict'

let UserController = {
    index: function(req, res) {
        res.status(200).json({ message: 'Welcome to the user area ' + req.user.username + '!' });
    }
};

module.exports = UserController;