const User = require('../models/User');
const Key = require('../models/Key');

exports.register = async (req, res) => {
    const { username, password, key, hwid } = req.body;

    if (!username || !password || !key || !hwid)
        return res.status(400).json({ msg: "All fields required" });

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ msg: "Username already exists" });

        const regKey = await Key.findOne({ key });
        if (!regKey || regKey.used)
            return res.status(400).json({ msg: "Invalid or already used key" });

        
        const user = new User({
            username,
            password,
            hwid,
            expiry: regKey.expiry
        });

        await user.save();

        regKey.used = true;
        regKey.usedBy = username;
        await regKey.save();

        res.json({ msg: "Registered successfully" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};


exports.bindHWID = async (req, res) => {
    const { username, hwid } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ msg: 'Invalid User' });

        if (user.hwid) return res.status(400).json({ msg: 'HWID already bound' });

        user.hwid = hwid;
        await user.save();

        res.status(200).json({ msg: 'HWID bound successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


exports.login = async (req, res) => {
  const { username, password, hwid } = req.body;

  if (!username || !password || !hwid) {
    return res.status(400).json({ msg: "Username, password, and HWID are required" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: "Invalid User" });
  }

  if (user.hwid !== hwid) {
    return res.status(400).json({ msg: "HWID doesn't match your system" });
  }

  const isMatch = password === user.password; // No hashing in your case
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password" });
  }

  const currentDate = new Date();
  if (currentDate > new Date(user.expiry)) {
    return res.status(400).json({ msg: "Account expired" });
  }

  res.json({ msg: "Login successful" });
};

