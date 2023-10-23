const { Project } = require('../database/schemas');

module.exports = function(app) {
  app.post("/project", async (req, res) => {
    const { name, description, adminUsers, users, maxCpu, maxRam, maxDisk } = req.body;
    if (!name || !adminUsers || !maxCpu || !maxRam || !maxDisk) {
      return res.status(400).send("Missing required fields");
    }
    //upsert project
    if(req.body._id) {
      const project = await Project.findById(req.body._id)
      for (const key in req.body) {
        project[key] = req.body[key]
      }
      await project.save()
      return res.json(project)
    } else {
      const newProject = new Project({ name, description, adminUsers, users, maxCpu, maxRam, maxDisk });
      try {
        await newProject.save()
      } catch (err) {
        console.log(`Error Saving project: ${err}`)
        return res.status(400).send(err)
      }
      res.json(newProject);
    }
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

  app.get("/project/:id", async (req, res) => {
    const { id } = req.params
    const project = await Project.findById(id).populate('users').populate('adminUsers')
    return res.json(project)
  })

  //Get all projects for a user
  app.get("/project/user/:id", async (req, res) => {
    const { id } = req.params
    const projects = await Project.find({ users: id }).select(['name', 'description', 'createdAt', 'updatedAt'])
    return res.json(projects)
  })

  //Get all projects a user is an admin for
  app.get("/project/admin/:id", async (req, res) => {
    const { id } = req.params
    const projects = await Project.find({ adminUsers: id }).select(['name', 'description', 'createdAt', 'updatedAt'])
    return res.json(projects)
  })

}