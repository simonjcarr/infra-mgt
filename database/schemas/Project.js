const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  adminUsers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
})

projectSchema.statics.getAdminUsers = function() {
  return this.find({}).populate('adminUsers').exec();
}

projectSchema.statics.getUsers = function() {
  return this.find({}).populate('users').exec();
}

projectSchema.pre('save', function(next) {
  this.wasNew = this.isNew;
  this.updatedAt = Date.now();
  next();
});



module.exports = mongoose.model('Project', projectSchema);