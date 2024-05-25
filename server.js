const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

let loggedInUser = '';

// Rute untuk halaman login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Rute utama diarahkan ke halaman login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Proses login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Lakukan validasi login di sini (untuk saat ini kita anggap login selalu berhasil)
    loggedInUser = email;
    res.redirect('/verify');
});

// Rute untuk halaman verifikasi email
app.get('/verify', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Mengirim email verifikasi
app.post('/send-verification-email', (req, res) => {
    const userEmail = loggedInUser;
    console.log(`Mengirim email ke: ${userEmail}`);

    let transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '5ce79390db2067', // Ganti dengan username dari Mailtrap
            pass: '4ff659e21f2f52'  // Ganti dengan password dari Mailtrap
        }
    });

    let mailOptions = {
        from: 'rnkur99@gmail.com', // Ganti dengan email pengirim
        to: userEmail,
        subject: 'Verifikasi Email Anda',
        html: `<p>Harap klik link di bawah ini untuk verifikasi email Anda:</p>
               <a href="http://localhost:3000/verify-email?email=${userEmail}">Verifikasi Email</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error saat mengirim email:', error);
            return res.status(500).send('Error saat mengirim email.');
        }
        console.log('Email verifikasi telah dikirim:', info.response);
        res.status(200).send('Email verifikasi telah dikirim. Silakan cek email Anda.');
    });
});

// Rute untuk verifikasi email
app.get('/verify-email', (req, res) => {
    const userEmail = req.query.email;
    console.log(`Email ${userEmail} berhasil diverifikasi!`);
    res.send(`<h1>Email ${userEmail} berhasil diverifikasi!</h1>`);
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}/login`);
});
