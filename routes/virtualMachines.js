const { VirtualMachine } = require('../database/schemas');

module.exports = function(app) {
  app.post("/vm", async (req, res) => {
    const {
      name,
      hostname,
      cpu,
      ram,
      disk,
      os,
      otherDisks,
      description,
      osFamily,
      project,
    } = req.body;
    if (!name || !hostname || !cpu || !ram || !disk || !os || !project ) {
      console.log("Missing required Fields")
      return res.status(400).send("Missing required fields");
    }
    const newVirtualMachine = new VirtualMachine(req.body);
    await newVirtualMachine.save()
    res.json(newVirtualMachine);
  })

  app.get("/vm", async (req, res) => {
    const vms = await VirtualMachine.find()
    return res.json(vms)
  })

}