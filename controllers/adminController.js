const User = require('../models/User');
const Key = require('../models/Key');
const { randomBytes } = require("crypto");
const moment = require("moment");



exports.renderAdminPage = async (req, res) => {
    try {
        const users = await User.find();
        const keys = await Key.find();
        res.render('admin', { users, keys, moment });  // 👈 moment passed here
    } catch (err) {
        res.status(500).send("Server error");
    }
};
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);  // <-- JSON return karo, render nahi
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin')
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { username, expiry } = req.body;
        const parsedExpiry = moment(expiry, "DD-MM-YYYY").endOf("day");

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                expiry: parsedExpiry.toDate()
            },
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ msg: "Update failed" });
    }
};

// Delete Key
exports.deleteKey = async (req, res) => {
  try {
      await Key.findByIdAndDelete(req.params.id);
      res.redirect("/admin#keys"); // redirect to the key listing page
      
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};



exports.getKeys = async (req, res) => {
    const keys = await Key.find();
    res.json(keys);
};



function generateMaskedKey(mask = 'XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return mask.split('-').map(group => {
    return Array.from({ length: group.length }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }).join('-');
}

exports.generateKey = async (req, res) => {
  try {
    const {
      amount = 1,
      mask = 'XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX',
      note = '',
      expiry_unit = 'Days',
      duration = 1
    } = req.body;

    // Calculate expiry
    const now = moment();
    const expiry = now.add(duration, expiry_unit.toLowerCase()).toDate();

    const keys = [];

    for (let i = 0; i < amount; i++) {
      const key = generateMaskedKey(mask);
      const newKey = new Key({
        key,
        expiry,
        note
      });
      await newKey.save();
      keys.push(key);
    }

    res.redirect("/admin#keys");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
