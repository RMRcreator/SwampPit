const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Age: {
            type: String,
            required: true,
        },
        Year: {
            type: String,
            required: true,
        },
        Major: {
            type: String,
            required: true,
        },
        Classes: {
            type: String,
            required: true,
        },
        Interests: {
            type: String,
            required: true,
        },
    },
    { timestamps: true}
);

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;