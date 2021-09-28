const dbQuery = require("./dbQuery")

module.exports = {
	async userFriends(db,userId){
		return await dbQuery(
			db,
			"SELECT u.id AS userId, pseudo FROM users AS u  LEFT JOIN friends AS f1 ON f1.userId1=u.id LEFT JOIN friends AS f2 ON f2.userId2=u.id  WHERE  (f1.userId2 = ? OR f2.userId1 = ?)",
			[userId, userId]
		)
	},

	async hasFriend(db,userId,friendId) {
		return await dbQuery(
			db,
			"SELECT u.id AS userId, pseudo FROM users AS u LEFT JOIN friends AS f1 ON f1.userId1=u.id LEFT JOIN friends AS f2 ON f2.userId2=u.id  WHERE  (f1.userId2 = ? AND f1.userId1=?) OR (f2.userId2 = ? AND f2.userId1=?)",
			[userId, friendId, friendId, userId]
		)
	}
	
}