const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Load tasks from data.json
let tasks = [];
try {
    const data = fs.readFileSync('data.json', 'utf8');
    tasks = JSON.parse(data);
} catch (err) {
    console.error('Error reading data file:', err);
}

// Route to get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Route to get a single task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Route to create a new task
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        status
    };
    tasks.push(newTask);
    saveTasksToFile();
    res.status(201).json(newTask);
});

// Route to update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...req.body
        };
        saveTasksToFile();
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasksToFile();
        res.sendStatus(204);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Save tasks to data.json
function saveTasksToFile() {
    fs.writeFileSync('data.json', JSON.stringify(tasks, null, 2));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
