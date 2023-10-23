const { virtualMachine } = require('../database/schemas');

module.exports = function(app) {
  app.post("/vm", async (req, res) => {
    const {
      name,
      hostname,
      cpu,
      ram,
      disk,
      os,
      description
    } = req.body;
    if (!name || !hostname || !cpu || !ram || !disk || !os) {
      return res.status(400).send("Missing required fields");
    }
  })
}