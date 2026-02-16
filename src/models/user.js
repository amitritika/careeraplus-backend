const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    max: 32,
    unique: true,
    index: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true
  },
  profile: { type: String, required: true },
  profile_photo: { data: Buffer, contentType: String },
  profile_resume: { type: mongoose.Schema.Types.Mixed },
  resume_photo: { data: Buffer, contentType: String },
  hashed_password: { type: String, required: true },
  salt: String,
  about: String,
  role: { type: Number, default: 0 },
  photo: { data: Buffer, contentType: String },
  resetPasswordLink: { type: String, default: '' },
  examplan: {
    goal: { type: [mongoose.Schema.Types.Mixed] },
    calendar: { type: mongoose.Schema.Types.Mixed },
    test: { type: [mongoose.Schema.Types.Mixed], default: [] },
    answersresponse: { type: [mongoose.Schema.Types.Mixed], default: [] },
    overallresponse: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  dailytest: {
    test: { type: [mongoose.Schema.Types.Mixed], default: [] },
    answersresponse: { type: [mongoose.Schema.Types.Mixed], default: [] },
    overallresponse: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  visualresume: {
    typeOfResume: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  visualresumepro: {
    typeOfResume: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  visualresumeexp: {
    typeOfResume: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  transactions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  version: { type: Number, default: 1 }
}, { timestamps: true });

// virtual password
userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
};

const IdentitySchema = new Schema({
  provider: { type: String, enum: ['google', 'facebook', 'linkedin'], required: true },
  providerId: { type: String, required: true }
}, { _id: false });

userSchema.add({
  identities: { type: [IdentitySchema], default: [] },
  emailVerified: { type: Boolean, default: false }
});

userSchema.methods.linkIdentity = function (provider, providerId) {
  if (!this.identities.some(i => i.provider === provider && i.providerId === providerId)) {
    this.identities.push({ provider, providerId });
  }
};

module.exports = mongoose.model('User', userSchema);
