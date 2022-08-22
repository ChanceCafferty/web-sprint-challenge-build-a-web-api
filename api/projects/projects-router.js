// Write your "projects" router here!
const express = require("express");
const Projects = require("./projects-model")

const projectsRouter = express.Router();

// Returns an array of projects as the body of the response.
// If there are no projects it responds with an empty array.
projectsRouter.get("/", async (req, res) => {
    try {
        const projects = await Projects.get();

        return res.status(200).send(projects || []);
    } catch (_) {
        return res.status(500).send();
    }
});

// Returns a project with the given id as the body of the response.
// If there is no project with the given id it responds with a status code 404.
projectsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const project = await Projects.get(id);

        if (project) {
            return res.status(200).send(project);
        } else {
            return res.status(404).send();
        }
    } catch (_) {
        return res.status(500).send();
    }
});

// Returns the newly created project as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
projectsRouter.post("/", async (req, res) => {
    if (!req.body) return res.status(400).send('Request body is missing')
    const { name, description, completed } = req.body;

    if (!name || !description) {
        return res.status(400).send('Required fields are missing');
    }

    let payload = { name, description };
    // `completed` is an optional field, so it may be undefined in the request
    if (completed !== undefined) {
        payload.completed = completed;
    }

    try {
        const newProject = await Projects.insert(payload);

        return res.status(201).send(newProject);
    } catch (_) {
        return res.status(500).send();
    }
});

// Returns the updated project as the body of the response.
// If there is no project with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
projectsRouter.put("/:id", async (req, res) => {
    if (!req.body) return res.status(400).send()
    const { name, description, completed } = req.body;
    const { id } = req.params;

    if (!name || !description || completed === undefined) {
        return res.status(400).send();
    }

    try {
        const updatedProject = await Projects.update(id, { name, description, completed });

        if (!updatedProject) {
            return res.status(404).send();
        } else {
            return res.status(201).send(updatedProject);
        }
    } catch (_) {
        return res.status(500).send();
    }
});

// Returns no response body.
// If there is no project with the given id it responds with a status code 404.
projectsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // check if project with given id exists
        const existingProject = await Projects.get(id);
        console.log(existingProject);
        if (existingProject) {
            await Projects.remove(id);
            return res.status(204).send();
        } else {
            return res.status(404).send();
        }
    } catch (_) {
        return res.status(500).send();
    }
});

// Returns an array of actions (could be empty) belonging to a project with the given id.
// If there is no project with the given id it responds with a status code 404.
projectsRouter.get("/:id/actions", async (req, res) => {
    const { id } = req.params;

    try {
        // check if project with given id exists
        const existingProject = await Projects.get(id);

        if (existingProject) {
            const projectActions = await Projects.getProjectActions(id);
            return res.status(200).send(projectActions);
        } else {
            return res.status(404).send();
        }
    } catch (_) {
        return res.status(500).send();
    }
});

module.exports = projectsRouter;