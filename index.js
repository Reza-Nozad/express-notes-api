// Importieren der notwendigen Module
const express = require('express');
const bodyParser = require('body-parser');

// Initialisieren der Express-App
const app = express();
const port = process.env.NOTES_APP_PORT || 8080;

// Middleware zum Parsen von JSON
app.use(bodyParser.json());

// Array zum Speichern der Notizen
let notes = [];

// Helper-Funktion, um eine Notiz anhand der ID zu finden
const findNoteIndexById = (id) => notes.findIndex((note) => note.id === id);

// GET /notes - Alle Notizen abrufen
app.get('/notes', (req, res) => {
  res.json(notes);
});

// GET /notes/:id - Eine Notiz anhand der ID abrufen
app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find((n) => n.id === id);
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

// POST /notes - Neue Notiz hinzufügen
app.post('/notes', (req, res) => {
  const { note, autor, date } = req.body;

  if (!note || !autor || !date) {
    return res.status(400).json({ error: 'Invalid note format' });
  }

  const newNote = {
    id: `${Date.now()}`, // Generiere eine einfache eindeutige ID
    note,
    autor,
    date,
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT /notes/:id - Eine Notiz aktualisieren
app.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const { note, autor, date } = req.body;

  if (!note || !autor || !date) {
    return res.status(400).json({ error: 'Invalid note format' });
  }

  const index = findNoteIndexById(id);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes[index] = { id, note, autor, date };
  res.json(notes[index]);
});

// DELETE /notes/:id - Eine Notiz löschen
app.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  const index = findNoteIndexById(id);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const deletedNote = notes.splice(index, 1);
  res.json(deletedNote[0]);
});

// Server starten
app.listen(port, () => {
  console.log(`Notes API is running on http://localhost:${port}`);
});
