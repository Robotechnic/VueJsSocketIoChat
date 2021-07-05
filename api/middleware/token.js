const jwt = require("jsonwebtoken")

module.exports = (req,res,next) => {
	const body = req.body
	if (!body.token){ //check if token exist
		res.status(422).json({
			error:"Field 'token' required",
			code:"TOKEN_FIELD_REQUIRED"
		})
		return
	}

	//check validity of token
	if (!jwt.verify(body.token, process.env.TOKEN_SECRET)){
		res.status(401).json({
			error:"Invalid token, it may be expired or invalid",
			code:"INVALID_TOKEN"
		})
		return
	}
	
	const token = jwt.decode(body.token)

	//check ip
	if (token.ip != req.ip){
		res.status(401).json({
			error: "Invalid ip, this token has different ip than your",
			code: "INVALID_IP"
		})
		return
	}

	req.token = token

	next()
}