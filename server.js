const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const notes = require('./db/db.json')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(`${req.method} request received for home page`);
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    console.log(`${req.method} request received for notes`);
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received for API notes`);
    const updateNotes = JSON.parse(fs.readFileSync('./db/db.json'))
    res.status(200).json(updateNotes);
});

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} recieved for notes`)
    const { title, text } = req.body
    if(req.body) {
    const newNote = {
        title,
        text,
        id: uuidv4(),
    };
    const updateNotes = JSON.parse(fs.readFileSync('./db/db.json'))
    updateNotes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(updateNotes) , (err) =>
        err ? res.status(500).json('Error in writing note') : res.status(201).json(`Note added successfully: ${JSON.stringify(newNote)}`)
    );
    }else {
        res.status(500).send('You fucked up')
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request recieved for notes`)
    const noteID  = req.params.id;
    const updateNotes = JSON.parse(fs.readFileSync('./db/db.json'));
    let deletedNotes = updateNotes.filter( note => note.id !== noteID); 
    // console.log(notes);
    fs.writeFile('./db/db.json', JSON.stringify(deletedNotes) , (err) =>
        err ? res.status(500).json('Error in writing note') : res.status(201).json(`Note deleted successfully, id: ${JSON.stringify(noteID)}`)
    );
    console.log(deletedNotes);
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);

