const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { Name } = req.body;

    if (Name) {
      user.Name = Name;
      await user.save();
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const result = await User.deleteOne({ ID: req.user.ID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
};