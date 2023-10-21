const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  keycloakId: String,
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
})


module.exports = mongoose.model('User', userSchema);