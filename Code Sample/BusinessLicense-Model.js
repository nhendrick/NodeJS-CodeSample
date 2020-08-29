
let mongoose = require('mongoose');
let validator = require('validator');

let BusinessSchema = new mongoose.Schema({
  license: {
    type: String,
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /\D{3}-\d{5}/.test(v);
      },
      message: props => `${props.value} is not a valid license number!`
    },
    required: [true, 'Business License required']
  },
  businessname: {
    type: String,
    unique: true,
    uppercase: true,
    required: [true, 'Business Name required']
  },  
  ownerfirstname: {
    type: String,
    uppercase: true,
    validate: (value) => {
      return validator.isAlpha(value);
    },
    required: [true, 'Owner first name required']
  },
  ownerlastname: {
    type: String,
    uppercase: true,
    validate: (value) => {
      return validator.isAlpha(value);
    },
    required: [true, 'Owner last name required']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Business phone number required']
  },
  email: {
    type: String,
    uppercase: true,
    validate: (value) => {
      return validator.isEmail(value);
    },
    required: [true, 'Email required']
  },
  address: {
    type: Object,
    required: [true, 'Address required']
  },
  lastinspectiondate: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{4}-\d{2}-\d{2}/.test(v);
      },
      message: props => `${props.value} is not a valid date!`
    },
    required: [true, 'Last Inspection Date required']
  },
},{timestamps: true});

module.exports = mongoose.model('BusinessLicense', BusinessSchema);
