const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());

const generatedDir = path.join(__dirname, 'public');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir);
}

app.use((req, res, next) => {
  const host = req.headers.host.split(':')[0]; 
  const subdomain = host.split('.')[0];
  
  const filePath = path.join(__dirname, 'public', `${subdomain}.html`);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      next();
    } else {
      res.sendFile(filePath);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/create-file/:subdomain", (req, res) => {
    const { subdomain } = req.params;
    const { content } = req.body;
  
    console.log("Subdomain:", subdomain);
    console.log("Content:", content);
  
    const filePath = path.join(__dirname, "public", `${subdomain}.html`);
  
    if (!content) {
      return res.status(400).send("Content is required");
    }
  
    const newFile = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      ${content}
    </body>
    </html>
    `;
  
    fs.writeFile(filePath, newFile, (err) => {
      if (err) {
        res.status(500).send("Error creating file");
      } else {
        res.send(`File created: ${filePath}`);
      }
    });
  });

app.use((req, res, next) => {
  express.static(path.join(__dirname, 'public'))(req, res, next);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://todo.localhost:${port}`);
});




// ======= http://todo.localhost:5000/
// ======= http://{your-domain}.todo.localhost:5000/ 
// ex: http://about.todo.localhost:5000/ 