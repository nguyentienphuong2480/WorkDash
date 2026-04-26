const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const data = await authService.login(username, password);

    return res.json({
      message: "Login successful",
      data
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required"
      });
    }

    const data = await authService.refresh(refreshToken);

    return res.json(data);
  } catch (err) {
    return res.status(401).json({
      message: err.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    await authService.logout(refreshToken);

    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = req.user;

    return res.json({
      data: { id: user.id, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};