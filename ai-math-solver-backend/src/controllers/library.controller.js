const User = require('../models/User');
const crypto = require('crypto');

const getLibrary = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.Library);
  } catch (error) {
    console.error('Library fetch error:', error);
    res.status(500).json({ message: 'Error fetching library', error: error.message });
  }
};

const addToLibrary = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const libraryItem = {
      id: crypto.randomUUID(),
      problem: req.body.problem,
      solution: req.body.solution,
      title: req.body.title || 'Untitled',
      timestamp: new Date(),
    };

    user.Library.push(libraryItem);
    await user.save();

    res.json({ message: 'Added to library', item: libraryItem });
  } catch (error) {
    console.error('Library add error:', error);
    res.status(500).json({ message: 'Error adding to library', error: error.message });
  }
};

const removeFromLibrary = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.Library.findIndex(
      (item) => item.id === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    user.Library.splice(itemIndex, 1);
    await user.save();

    res.json({ message: 'Item removed from library' });
  } catch (error) {
    console.error('Library remove error:', error);
    res.status(500).json({ message: 'Error removing from library', error: error.message });
  }
};

const clearLibrary = async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.user.ID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.Library = [];
    await user.save();

    res.json({ message: 'Library cleared successfully' });
  } catch (error) {
    console.error('Library clear error:', error);
    res.status(500).json({ message: 'Error clearing library', error: error.message });
  }
};

module.exports = {
  getLibrary,
  addToLibrary,
  removeFromLibrary,
  clearLibrary
};