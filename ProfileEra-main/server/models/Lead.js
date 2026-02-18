const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain alphabets and spaces']
  },
  contact: {
    type: String, // String to preserve leading zeros if any, though 10 digit requirement usually implies mobile
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Contact number must be exactly 10 digits']
  },
  linkedin: {
    type: String,
    match: [/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,})$/, 'Please enter a valid URL']
  },
  naukri: {
    type: String,
    match: [/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,})$/, 'Please enter a valid URL']
  },
  resume: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
