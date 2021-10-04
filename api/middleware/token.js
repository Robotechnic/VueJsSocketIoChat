const jwt = require("jsonwebtoken")

module.exports = (req,res,next) => {
	const body = req.body
	if (!body.token){ // check if token exist
		res.status(422).json({
			error:"Field 'token' required",
			code:"EMPTY_FIELDS"
		})
		return
	}

	//  check validity of token
	try {
		jwt.verify(body.token, process.env.TOKEN_SECRET)
	} catch (err) {
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({
				error: "Token is invalid",
				code: "INVALID_TOKEN"
			})
		}

		if (err.name === "TokenExpiredError") {
			return res.status(401).json({
				error: "Token is expired",
				code: "EXPIRED_TOKEN"
			})
		}

		console.log(err) // log error only if it's unknown
		return res.status(500).json({
			error: "Internal error",
			code: "INTERNAL"
		})
	}
	
	const token = jwt.decode(body.token)

	// check ip
	if (token.ip !== req.ip){
		res.status(401).json({
			error: "Invalid ip, this token has different ip than your",
			code: "INVALID_TOKEN_IP"
		})
		return
	}

	req.token = token

	next()
}