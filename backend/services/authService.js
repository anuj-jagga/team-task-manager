const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforassignment123';

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'Admin' ? 'Admin' : 'Member';

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: userRole,
  });

  await user.save();
  const token = generateToken(user);

  return { token, user: formatUser(user) };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  return { token, user: formatUser(user) };
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const getAllUsers = async () => {
  return await User.find().select('name email role');
};

// Helpers
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const formatUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
};
