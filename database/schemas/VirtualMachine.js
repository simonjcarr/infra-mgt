const mongoose = require('mongoose');

const virtualMachineSchema = new mongoose.Schema({
  name: {type: String, required: true},
  hostname: String,
  ipv4: String,
  cpu: Number,
  ram: Number,
  disk: Number,
  otherDisks: [{
    name: String,
    size: Number,
    mountPoint: String
  }],
  users: [{
    name: String,
    sudo: String,
  }],
  os: String,
  osFamily: String,
  description: String,
  createStatus: { type: String, default: 'not-started' },
  createLog: [{
    date: { type: Date, default: Date.now },
    message: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },

})

virtualMachineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('VirtualMachine', virtualMachineSchema);