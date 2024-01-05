const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route untuk halaman utama
router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});

// Route untuk proses pendaftaran pengguna
router.post('/', (req, res, next) => {
	let personInfo = req.body;

	// Memastikan data yang dibutuhkan diisi
	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		// Memastikan kata sandi dan konfirmasi kata sandi cocok
		if (personInfo.password == personInfo.passwordConf) {

			// Mengecek apakah email telah digunakan sebelumnya
			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					let c;
					// Menemukan ID unik terakhir untuk menetapkan ID unik baru
					User.findOne({}, (err, data) => {

						if (data) {
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						// Membuat objek pengguna baru
						let newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						// Menyimpan pengguna baru ke database
						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

// Route untuk halaman login
router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

// Route untuk proses login
router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				// Menetapkan ID pengguna ke sesi
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });
			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

// Route untuk halaman profil
router.get('/profile', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			// Jika tidak ada data pengguna, redirect ke halaman utama
			res.redirect('/');
		} else {
			// Menampilkan data pengguna di halaman profil
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});

// Route untuk logout
router.get('/logout', (req, res, next) => {
	if (req.session) {
		// Menghapus objek sesi
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

// Route untuk lupa kata sandi
router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

// Route untuk proses lupa kata sandi
router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			if (req.body.password == req.body.passwordConf) {
				// Mengganti kata sandi dan kata sandi konfirmasi
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				// Menyimpan perubahan kata sandi ke database
				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

module.exports = router;