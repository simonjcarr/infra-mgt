const { Project } = require('../database/schemas');

module.exports = function(app) {
  app.post("/project", async (req, res) => {
    const newProject = new Project({ ...req.body });
    try {
      await newProject.save()
      console.log("project saved")
    } catch (err) {
      console.log(`Error Saving project: ${err}`)
      return res.status(400).send(err)
    }
    res.json(newProject);
  })

  app.get("/project", async (req, res) => {
    const projects = await Project.find().populate('users').populate('adminUsers')
    return res.json(projects)
  })

  app.delete("/project/:id", async (req, res) => {
    const { id } = req.params
    const project = await Project.findByIdAndDelete(id)
    return res.json(project)
  })
}