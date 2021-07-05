const jwt = require("jsonwebtoken")

module.exports = (id,ip) => {
	//generate access token
	const accessToken = jwt.sign({
		id,
		ip
	}, process.env.TOKEN_SECRET, { expiresIn: process.env.ACESS_TOKEN_EXPIRE })

	const refreshToken = jwt.sign({
		id
	}, process.env.TOKEN_SECRET, { expiresIn: process.env.UPDATE_TOKEN_EXPIRE })

	return { accessToken, refreshToken}
}