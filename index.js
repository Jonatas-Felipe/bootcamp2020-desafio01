const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let count_req = 0;

server.use((req, res, next) => {
    count_req++;
    console.log(count_req);
    return next();
});

function find(req, res, next) {
    const id_project = req.params.id;
    const result = projects.findIndex(({ id }) => id == id_project);
    if(result == -1){
        return res.status(400).json({ erro: 'O projeto não existe.' });
    }
    req.result = result;
    return next();
}

server.post("/projects", (req, res) => {
    const { id, title } = req.body;
    projects.push({ id, title });
    return res.json(projects);
});

server.get("/projects", (req, res) => {
    return res.json(projects);
});

// server.get("/projects/:id", find, (req, res) => {
//     result = req.result;
//     return res.json(result);
// });

server.put("/projects/:id", find, (req, res) => {
    const index = req.result;
    const { title } = req.body;
    projects[index].title = title;
    return res.json(projects);
});

server.delete("/projects/:id", find, (req, res) => {
    const index = req.result;
    projects.splice(index, 1);
    return res.send();
});

server.post("/projects/:id/tasks", find, (req, res) => {
    const index = req.result;
    const { tarefas } = req.body;
    
    if(projects[index].tasks){
        projects[index].tasks.push(tarefas);
    }else{
        projects[index].tasks = [tarefas];
    }

    return res.json(projects);
});

server.listen(3333);