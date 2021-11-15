const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    blacklisted: {
        type: Boolean,
        required: true,
        default: false,
    },
    totalBumps: {
        type: Number,
        required: true,
        default: 0,
    },
    bumpsThisWeek: {
        type: Number,
        required: true,
        default: 0,
    },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
