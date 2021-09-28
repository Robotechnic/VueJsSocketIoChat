module.exports = async (db,request,args=[]) => {
	let conn
	let result
	let err
	try {
		conn = await db.getConnection()
		result = await conn.query(request,args)
	} catch (error) {
		console.log(error)
		err = error
	} finally {
		if (conn)
			conn.release()
	}

	return {
		result,
		err
	}
}