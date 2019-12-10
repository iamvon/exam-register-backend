'use strict'

let UserController = {
    index: function(req, res) {
        res.status(200).json({ message: 'Welcome to the user area ' + req.user.username + '!' });
    }
};

// UserController.deleteUser = function (req, res) {
//     db.sync().then(function () {
//         User.findOne({ where: { username: req.body.username } }).then(function (user) {
//             if (!user) {
//                 res.status(403).json({ message: `User ${req.body.username} not exist!` })
//                 return
//             }

//             return User.destroy({ where: { username: req.body.username } }).then(function () {
//                 res.status(201).json({ message: `User ${req.body.username} deleted!` });
//             })
//         })
//     })
// }

module.exports = UserController;