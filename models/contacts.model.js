const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  created_at: { type: Date, default: new Date() },
  user_id: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  country_code: { type: String, required: true },
  phone_number: { type: String, required: true },
});


const ContactModel = mongoose.model('contacts', ContactSchema);

module.exports = ContactModel;
