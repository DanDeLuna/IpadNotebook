//requires for app build
const express = require('express');
const path = require('path');
const PORT = process.env.port || 3001;
const app = express();
const fs = require('fs');
const todaNotas = require('./db/db.json');

//express app mentions
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app gets 

app.get('/api/notes', (req, res) => {
    res.json(todaNotas.slice(1));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
//hacernuveNota y nuveaNota y notasArr
function hacernuveNota(body, notasArr) {
    const nuveaNota = body;
    if (!Array.isArray(notasArr))
        notasArr = [];
    
    if (notesArray.length === 0)
        notasArr.push(0);

    body.id = notasArr[0];
    notasArr[0]++;

    notasArr.push(nuveaNota);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notasArr, null, 2)
    );
    return nuveaNota;
}

app.post('/api/notes', (req, res) => {
    const nuveaNota = hacernuveNota(req.body, todaNotas);
    res.json(nuveaNota);
});
//borraNota
function borraNota(id, notasArr) {
    for (let i = 0; i < notasArr.length; i++) {
        let note = notasArr[i];

        if (note.id == id) {
            notasArr.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notasArr, null, 2)
            );

            break;
        }
    }
}
app.delete('/api/notes/:id', (req, res) => {
    borraNota(req.params.id, todaNotas);
    res.json(true);
});
  
app.listen(PORT, () => {
    console.log(`API server on port ${PORT}!`);
});
