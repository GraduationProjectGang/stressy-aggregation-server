const express = require('express');
const math = require('mathjs');
const sr = require('secure-random');
const fs = require('fs');
const admin = require('firebase-admin');

// FCM initialize

var serviceAccount = require(".././serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://datacollect-18877.firebaseio.com"
});

// FCM Token Array
let tokens = new Array();

const SIZE_0W = 3072;
const SIZE_0RW = 65536;
const SIZE_0b = 512;
const SIZE_2W = 512;
const SIZE_2b = 4;

const WEIGHT_ELEMENT_SIZE = 69636;
const PARTY_THRESHOLD = 3;

let calculatedWeights = math.zeros(WEIGHT_ELEMENT_SIZE);
let finalWeights_0W = math.zeros(SIZE_0W);
let finalWeights_0RW = math.zeros(SIZE_0RW);
let finalWeights_0b = math.zeros(SIZE_0b);
let finalWeights_2W = math.zeros(SIZE_2W);
let finalWeights_2b = math.zeros(SIZE_2b);

let weightCount = 0;
let sizePadding = 1;

const router = express.Router();

router.post('/size/:sizePadding', async(req, res) => {
  try {
    sizePadding = Number(req.params.sizePadding);
    console.log(sizePadding);
    return res.status(201).json({
      code: 201,
      message: "accept sizePadding",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: 'update failed',
    });
  }
});


router.post('/send_w0', async (req, res) => {

  if (weightCount === 0) {
    calculatedWeights = math.zeros(WEIGHT_ELEMENT_SIZE);
    finalWeights_0W = math.zeros(SIZE_0W);
    finalWeights_0RW = math.zeros(SIZE_0RW);
    finalWeights_0b = math.zeros(SIZE_0b);
    finalWeights_2W = math.zeros(SIZE_2W);
    finalWeights_2b = math.zeros(SIZE_2b);
  }

  const { fcm_token, W_0, RW_0, b_0, W_2, b_2, partyId } = req.body;
  tokens.forEach((tk) => {
    if (tk === fcm_token) return;
  })
  tokens.push(fcm_token);

  const splitWeights_0W = W_0.replace("[", "").replace("]", "").split(",");
  const splitWeights_0RW = RW_0.replace("[", "").replace("]", "").split(",");
  const splitWeights_0b = b_0.replace("[", "").replace("]", "").split(",");
  const splitWeights_2W = W_2.replace("[", "").replace("]", "").split(",");
  const splitWeights_2b = b_2.replace("[", "").replace("]", "").split(",");

  let eachWeights_0W = [];
  let eachWeights_0RW = [];
  let eachWeights_0b = [];
  let eachWeights_2W = [];
  let eachWeights_2b = [];

  splitWeights_0W.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights_0W.push(parseFloat(each));
  });

  splitWeights_0RW.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights_0RW.push(parseFloat(each));
  });

  splitWeights_0b.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights_0b.push(parseFloat(each));
  });

  splitWeights_2W.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights_2W.push(parseFloat(each));
  });

  splitWeights_2b.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights_2b.push(parseFloat(each));
  });

  const matrix_0W = math.matrix(eachWeights_0W);
  const matrix_0RW = math.matrix(eachWeights_0RW);
  const matrix_0b = math.matrix(eachWeights_0b);
  const matrix_2W = math.matrix(eachWeights_2W);
  const matrix_2b = math.matrix(eachWeights_2b);

  finalWeights_0W = math.add(finalWeights_0W, matrix_0W);
  finalWeights_0RW = math.add(finalWeights_0RW, matrix_0RW);
  finalWeights_0b = math.add(finalWeights_0b, matrix_0b);
  finalWeights_2W = math.add(finalWeights_2W, matrix_2W);
  finalWeights_2b = math.add(finalWeights_2b, matrix_2b);

  weightCount += 1;
  
  if (weightCount === PARTY_THRESHOLD) {
    finalWeights_0W = math.divide(finalWeights_0W, sizePadding);
    finalWeights_0RW = math.divide(finalWeights_0RW, sizePadding);
    finalWeights_0b = math.divide(finalWeights_0b, sizePadding);
    finalWeights_2W = math.divide(finalWeights_2W, sizePadding);
    finalWeights_2b = math.divide(finalWeights_2b, sizePadding);

    sendFCM(tokens);
    tokens = [];
    weightCount = 0;
  }

  console.log(finalWeights_0W);
  console.log(finalWeights_0RW);
  console.log(finalWeights_0b);
  console.log(finalWeights_2W);
  console.log(finalWeights_2b);


  return res.status(201).json({
    code: 201,
    message: "send successfully"
  });

});

router.post('/receive_weights', async (req, res) => {
  res.json({
    finalWeights_0W,
    finalWeights_0RW,
    finalWeights_0b,
    finalWeights_2W,
    finalWeights_2b,
  });
});

const sendFCM = (tks) => {

  console.log("다 차서 FCM 보내");

  const message = {
    data: { title: "receiveWeights", body: "receiveWeights" },
    tokens: tks,
    priority: "10",
  };

  admin.messaging().sendMulticast(message)
    .then((response) => {
      console.log("Successfully sent message: ", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

}

module.exports = router;