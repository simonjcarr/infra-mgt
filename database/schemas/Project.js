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

projectSchema.post('save', function(doc, next) {
  console.log(this)
  if (this.wasNew) {
    doc.users.map(async (user) => {
      const userDoc = await mongoose.model('User').findById(user);
      userDoc.projects.push(doc._id);
      await userDoc.save();
      console.log(userDoc)
    })
  }
  next()
});


module.exports = mongoose.model('Project', projectSchema);