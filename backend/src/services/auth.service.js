const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, RefreshToken } = require("../models");
const { AppError } = require("../utils/AppError");

const REFRESH_DAYS = 7;

const signAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

exports.login = async (username, password) => {
  const user = await User.scope("withPassword").findOne({ where: { username } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const accessToken = signAccessToken(user.id);
  const refreshToken = crypto.randomBytes(40).toString("hex");

  // chỉ giữ 1 refresh token / user
  await RefreshToken.destroy({
    where: { user_id: user.id }
  });

  await RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: new Date(
      Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
    )
  });

  return { accessToken, refreshToken };
};

exports.refresh = async (token) => {
  const stored = await RefreshToken.findOne({
    where: { token }
  });

  if (!stored) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (stored.expires_at < new Date()) {
    await stored.destroy();
    throw new AppError("Refresh token expired", 401);
  }

  // ROTATE refresh token (QUAN TRỌNG)
  const newRefreshToken = crypto.randomBytes(40).toString("hex");

  const accessToken = signAccessToken(stored.user_id);

  await stored.update({
    token: newRefreshToken,
    expires_at: new Date(
      Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
    )
  });

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

exports.logout = async (token) => {
  if (!token) return;

  await RefreshToken.destroy({
    where: { token }
  });
};