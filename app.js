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

  db.query('CREATE DATABASE IF NOT EXISTS ogrenciDB', (err, result) => {
    if (err) {
      console.error('Veritabanı oluşturulamadı: ' + err.stack);
      return;
    }
    console.log('Veritabanı oluşturuldu ya da zaten var.');
  
    db.query('USE ogrenciDB', (err) => {
      if (err) {
        console.error('Veritabanı seçilemedi: ' + err.stack);
        return;
      }

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ogrenciler (
          ogrenciID INT AUTO_INCREMENT PRIMARY KEY,
          ad VARCHAR(100),
          soyad VARCHAR(100),
          bolumId INT
        )
      `;
      db.query(createTableQuery, (err, result) => {
        if (err) {
          console.error('Tablo oluşturulamadı: ' + err.stack);
          return;
        }
        console.log('Tablo oluşturuldu ya da zaten var.');
      });
    });
  });
});


app.get('/ogrenciler', (req, res) => {
  db.query('SELECT * FROM ogrenciler', (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Veritabanı hatası' });
      return;
    }
    res.json(results);
  });
});


app.post('/ogrenciler', (req, res) => {
  const { ad, soyad, bolumId } = req.body;
  db.query('INSERT INTO ogrenciler (ad, soyad, bolumId) VALUES (?, ?, ?)', [ad, soyad, bolumId], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Öğrenci eklenemedi' });
      return;
    }
    res.status(201).json({ message: 'Öğrenci eklendi', id: result.insertId });
  });
});

app.put('/ogrenciler/:id', (req, res) => {
  const { id } = req.params;
  const { ad, soyad, bolumId } = req.body;
  db.query('UPDATE ogrenciler SET ad = ?, soyad = ?, bolumId = ? WHERE ogrenciID = ?', [ad, soyad, bolumId, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Öğrenci güncellenemedi' });
      return;
    }
    res.json({ message: 'Öğrenci güncellendi' });
  });
});

app.delete('/ogrenciler/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ogrenciler WHERE ogrenciID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Öğrenci silinemedi' });
      return;
    }
    res.json({ message: 'Öğrenci silindi' });
  });
});

app.listen(port, () => {
  console.log(`API sunucusu http://localhost:${port} adresinde çalışıyor`);
});