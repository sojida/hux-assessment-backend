const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  created_at: { type: Date, default: new Date() },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
});

// before save
UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
})

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
   
   delete userObject.password; // remove user password from response
   
   return userObject;
};
   

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
