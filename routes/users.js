const { User } = require('../database/schemas');

module.exports = function(app) {
  app.post("/user", async (req, res) => {
    const { name, keycloakId } = req.body;
    const user = new User({ name, keycloakId });
    try {
      await user.save()
      console.log("User saved")
    } catch (err) {
      return res.status(400).send(err)
      console.log(`Error Saving user: ${err}`)
    }
    res.json(user);
  })

  app.get("/user", async (req, res) => {
    const users = await User.find()
    return res.json(users)
  })

  app.get("/user/:id", async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    return res.json(user)
  })

  app.post("/user/:id", async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    for (const key in req.body) {
      user[key] = req.body[key]
    }
    await user.save()
    return res.json(user)
  })
}