// Menggunakan modul Mongoose untuk berinteraksi dengan MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Mendefinisikan skema pengguna (user)
userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
}),
// Membuat model pengguna (User) berdasarkan skema yang telah didefinisikan
User = mongoose.model('User', userSchema);

module.exports = User;