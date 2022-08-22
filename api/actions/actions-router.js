// Write your "actions" router here!
const express = require("express");
const Actions = require("./actions-model")
const Projects = require("../projects/projects-model");

const actionsRouter = express.Router();

// Returns an array of actions (or an empty array) as the body of the response.
actionsRouter.get("/", async (req, res) => {
    try {
        let actions = await Actions.get();

        return res.status(200).send(actions || []);
    } catch (error) {
        return res.status(500).send();
    }
});


// Returns an action with the given id as the body of the response.
// If there is no action with the given id it responds with a status code 404.
actionsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const action = await Actions.get(id);

        if (action) {
            return res.status(200).send(action);
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        return res.status(500).send();
    }
});

// Returns the newly created action as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
// When adding an action make sure the project_id provided belongs to an existing project.
actionsRouter.post("/", async (req, res) => {
    if (!req.body) return res.status(400).send()
    const { project_id, description, notes, completed } = req.body;

    if (!project_id || !description || !notes) {
        return res.status(400).send();
    }
    try {
        // check that project_id belongs to an existing project
        const existingProject = await Projects.get(project_id);
        if (!existingProject) {
            return res.status(404).send();
        }

        let payload = { project_id, notes, description };
        // `completed` is an optional field, so it may be undefined in the request
        if (completed !== undefined) {
            payload.completed = completed;
        }

        const newAction = await Actions.insert(payload);

        return res.status(201).send(newAction);
    } catch (error) {
        return res.status(500).send();
    }
});

// Returns the updated action as the body of the response.
// If there is no action with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
actionsRouter.put("/:id", async (req, res) => {
    if (!req.body) return res.status(400).send()
    const { project_id, description, notes, completed } = req.body;
    const { id } = req.params;

    if (!project_id || !description || !notes || completed === undefined) {
        return res.status(400).send();
    }
    try {
        const updatedAction = await Actions.update(id, { project_id, description, notes, completed });

        if (!updatedAction) {
            return res.status(404).send();
        } else {
            return res.status(201).send(updatedAction);
        }
    } catch (error) {
        return res.status(500).send();
    }
});


// Returns no response body.
// If there is no action with the given id it responds with a status code 404.
actionsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // check if action with given id exists
        const existingAction = await Actions.get(id);
        if (existingAction) {
            await Actions.remove(id);
            return res.status(404).send();
        } else {
            return res.status(204).send();
        }
    } catch (error) {
        return res.status(500).send();
    }
});

module.exports = actionsRouter;