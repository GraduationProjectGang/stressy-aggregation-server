const e = require('express');
const jwt = require('jsonwebtoken');

exports.requestGlobalModel = (req, res, next) => {
  
};

exports.verifyTokenClient = (req, res, next) => { //내가 발급한 jwt 토큰이 맞는지
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    console.log(req.decoded);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: 'expired token',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'invalid token',
    });
  }
};

exports.verifyTokenGlobal = (req, res, next) => { //러닝서버랑 통신하는 토큰 
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_GLOBAL);
    console.log(req.decoded);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: 'expired token',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'invalid token',
    });
  }

};

exports.verifyTokenMiddle = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_MIDDLE);
    console.log(req.decoded);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: 'expired token',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'invalid token',
    });
  }
}
