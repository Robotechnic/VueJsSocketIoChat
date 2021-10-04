const dbQuery = require("./dbQuery")

module.exports = {
	async userFriends(db,userId){
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId, pseudo FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND(f1.userId2 = ? OR f1.userId1 = ?) AND f1.pending = false",
			[userId, userId, userId]
		)
	},

	async hasFriend(db,userId,friendId) {
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId,pseudo FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND (    (f1.userId2 =? AND f1.userId1 =?) "+
						      " OR  (f1.userId2 =? AND f1.userId1 =?)) "+
				"AND f1.pending = false",
			[userId, userId, friendId, friendId, userId]
		)
	},

	async allFriendsRelations(db, userId) {
		return await dbQuery(
			db,
			"SELECT " +
				"u.id AS userId FROM users AS u " +
			"INNER JOIN " +
				"friends AS f1 ON f1.userId1 = u.id OR f1.userId2 = u.id " +
			"WHERE " +
				"u.id != ? AND(f1.userId2 =? OR f1.userId1 =?)",
			[userId, userId, userId]
		)
	},
	
	async searchFriend(db,userId,friendName,excludedId=[]) {
		return await dbQuery(
			db,
			"SELECT id AS userId, pseudo FROM users WHERE id != ? AND pseudo LIKE '%" + friendName + "%' AND id NOT IN (?)",
			[userId, excludedId]
		) 
	},

	async addFriendRequest(db, userId, friendId) {
		return await dbQuery(
			db,
			"INSERT INTO friends (userId1,userId2) VALUES (?,?)",
			[userId,friendId],
			false
		)
	},

	async acceptFriendRequest(db, requestId) {
		return await dbQuery(
			db,
			"UPDATE friends SET pending=false WHERE id=?",
			[requestId]
		)
	},

	async cancelFriendRequest(db, requestId) {
		return await dbQuery(
			db,
			"DELETE FROM friends WHERE id=?",
			[requestId]
		)
	},

	async getFriendRequest(db, userId) {
		return await dbQuery(
			db,
			"SELECT id as userId, pseudo FROM users WHERE id IN (SELECT userId2 FROM friends WHERE userId1=? AND pending=true)",
			[userId]
		)
	},

	async getFriendDemands(db, userId) {
		return await dbQuery(
			db,
			"SELECT f.id as id, u.id as userId, pseudo FROM users u INNER JOIN friends f ON userId1=u.id WHERE userId2=? AND pending=true",
			[userId]
		)
	}
}