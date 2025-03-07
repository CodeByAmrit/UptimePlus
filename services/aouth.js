const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const chabi = process.env.jwt_token;
const sessionIdToUserMap = new Map(); // For storing refresh tokens if needed

function setUser(user) {
  return jwt.sign(
    {
      _id: user.id,
      email: user.email,
      name: user.name
    },
    chabi,
    { expiresIn: "24h" } // Token expires in 24 hours
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, chabi);
  } catch (error) {
    return null;
  }
}

function logoutUser(id) {
  sessionIdToUserMap.delete(id);
}

module.exports = { setUser, getUser, logoutUser };
