const express = require('express');
     const app = express();
     const port = 3001;

     app.get('/', (req, res) => {
       res.send('Hello, World Of Devops Learning!');
     });

     app.listen(port, () => {
       console.log(`Backend running at http://localhost:${port}`);
     });