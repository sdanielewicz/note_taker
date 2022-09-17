const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to get reviews`);
   fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const serveNote = JSON.parse(data);
        
    res.json(serveNote);
        }})    
    })


app.post('/api/notes', (req,res) => {
    console.log(req.body);

// res.status(201).json({
//     message: "thing!"
// })

const { title, text, id } = req.body;

  // If all the required properties are present
  if (title && text && id) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid()
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(data);

        // Add a new review
        parsedNote.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});





app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);