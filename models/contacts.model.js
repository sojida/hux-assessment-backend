const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcrypt')
const mongoosePaginate = require('mongoose-paginate-v2');


const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
  userId: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

ContactSchema.plugin(mongoosePaginate);

const ContactModel = mongoose.model('contacts', ContactSchema);

module.exports = ContactModel;
