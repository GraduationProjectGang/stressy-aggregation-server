const express = require('express');
const math = require('mathjs');
const sr = require('secure-random');
const multer = require('multer');
const fs = require('fs');

let partyID = 0
let partyIndex = 0

const _storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'weights/');
  },
  filename: (req, file, cb) => {
    cb(null, `party_${partyID}/weights_${partyIndex}`);
  }
});

const router = express.Router();


router.post('/send_w0', async (req, res) => {

  const { W_0 } = req.body;

  if (!fs.existsSync(`weights/client_${partyIndex}`)) {
    fs.mkdirSync(`weights/client_${partyIndex}`);
  }

  const location = `weights/client_${partyIndex}/W_0.json`;

  fs.open(location, 'w+', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(location, W_0, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  if (fs.existsSync())

  res.send();

});

router.post('/send_rw0', async (req, res) => {

  const { RW_0 } = req.body;

  if (!fs.existsSync(`weights/client_${partyIndex}`)) {
    fs.mkdirSync(`weights/client_${partyIndex}`);
  }

  const location = `weights/client_${partyIndex}/RW_0.json`;

  fs.open(location, 'w+', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(location, RW_0, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  res.send();

});

router.post('/send_b0', async (req, res) => {

  const { b_0 } = req.body;

  if (!fs.existsSync(`weights/client_${partyIndex}`)) {
    fs.mkdirSync(`weights/client_${partyIndex}`);
  }

  const location = `weights/client_${partyIndex}/b_0.json`;

  fs.open(location, 'w+', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(location, b_0, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  res.send();

});

router.post('/send_w2', async (req, res) => {

  const { W_2 } = req.body;

  if (!fs.existsSync(`weights/client_${partyIndex}`)) {
    fs.mkdirSync(`weights/client_${partyIndex}`);
  }

  const location = `weights/client_${partyIndex}/W_2.json`;

  fs.open(location, 'w+', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(location, W_2, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  res.send();

});

router.post('/send_b2', async (req, res) => {

  const { b_2 } = req.body;

  if (!fs.existsSync(`weights/client_${partyIndex}`)) {
    fs.mkdirSync(`weights/client_${partyIndex}`);
  }

  const location = `weights/client_${partyIndex}/b_2.json`;

  fs.open(location, 'w+', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(location, b_2, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
  });

  res.send();

});

const calculateWeights = () => {



}


module.exports = router;