const bcrypt = require("bcryptjs");
const User = require("../models/").user;

const registerUser = (req, res, next) => {
	User.findOne({
		where: {
		email: req.body.email,
		}
	}).then((user) => {
		if(!user){
			User.create({
				name: req.body.name,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password, 8),
				role: req.body.role
			}).then((user) => {
				res.status(200).json({
					message: "User is registered"
				})
			})
		} else {
			res.status(200).json({
				message: "User is already registered"
			})
		}
	}).catch((err) => {
		console.log("Hit");
		res.json(err.message);
	});
}

module.exports = {
  registerUser
};
