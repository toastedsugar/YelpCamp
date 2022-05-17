const { string, required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
});
UserSchema.plugin(passportLocalMongoose);       // Creates username and password fields for us

module.exports = mongoose.model("User", UserSchema);

