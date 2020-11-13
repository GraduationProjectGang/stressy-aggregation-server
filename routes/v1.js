const express = require('express');
const math = require('mathjs');
const sr = require('secure-random');
const multer = require('multer');

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

router.post('/sendweight', multer({ storage: _storage }).single('weights'), async (req, res) => {

  const { party_id } = req.body;
  partyID = party_id;

  try {

    let file = req.file;
    let originalName = '';
    let fileName = '';
    let mimeType = '';
    let size = 0;

    if (file) {
      originalName = file.originalname;
      filename = file.filename;
      mimeType = file.mimetype;
      size = file.size;
      console.log("execute" + fileName);
    } else {
      console.log("request is null");
    }
  } catch (err) {
    console.dir(err.stack);
  }

  console.log(req.file);
  console.log(req.body);

  res.send("Uploaded : ", req.file);

});

router.post('/calculate', async (req, res) => {

  console.log(req);

  res.json();
});

module.exports = router;