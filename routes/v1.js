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

const WEIGHT_ELEMENT_SIZE = 69636;
const PARTY_THRESHOLD = 3;

let calculatedWeights = math.zeros(WEIGHT_ELEMENT_SIZE);
let weightCount = 0;

const router = express.Router();

router.post('/send_w0', async (req, res) => {

  if (weightCount === 0) {
    calculatedWeights = math.zeros(WEIGHT_ELEMENT_SIZE);
  }

  const { fcm_token, W_0 } = req.body;
  tokens.forEach((tk) => {
    if (tk === fcm_token) return;
  })
  tokens.push(fcm_token);

  console.log(W_0);

  const splitWeights = W_0.replace("[", "").replace("]", "").split(",");

  let eachWeights = [];
  splitWeights.forEach((iVal) => {
    const each = iVal.trim();
    eachWeights.push(parseFloat(each));
  });

  const w_matrix = math.matrix(eachWeights);

  calculatedWeights = math.add(calculatedWeights, w_matrix);
  weightCount += 1;
  
  if (weightCount === PARTY_THRESHOLD) {
    sendFCM(tokens);
    tokens = [];
    weightCount = 0;
  }

  console.log(calculatedWeights);

  return res.status(201).json({
    code: 201,
    message: "send successfully"
  });

});

router.post('/receive_weights', async (req, res) => {
  res.json(calculatedWeights);
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