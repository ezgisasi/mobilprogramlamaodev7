const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME  
});

db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı: ' + err.stack);
    return;
  }
  console.log('Veritabanına başarıyla bağlanıldı.');
});

app.post('/ogrenciler', (req, res) => {
  const { ad, soyad, bolumId } = req.body;
  db.query('INSERT INTO ogrenciler (ad, soyad, bolumId) VALUES (?, ?, ?)', [ad, soyad, bolumId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Öğrenci eklenemedi' });
    }
    res.status(201).json({ message: 'Eklendi', id: result.insertId });
  });
});

app.delete('/ogrenciler/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ogrenciler WHERE ogrenciID = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Öğrenci silinemedi' });
    }
    res.json({ message: 'Silindi' });
  });
});

app.put('/ogrenciler/:id', (req, res) => {
  const { id } = req.params;
  const { ad, soyad, bolumId } = req.body;
  db.query('UPDATE ogrenciler SET ad = ?, soyad = ?, bolumId = ? WHERE ogrenciID = ?', [ad, soyad, bolumId, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Öğrenci güncellenemedi' });
    }
    res.json({ message: 'Güncellendi' });
  });
});

app.listen(port, () => {
  console.log(`API sunucusu http://localhost:${port} adresinde çalışıyor`);
});
