const express  = require('express');
const app = express();
const port = 1001;

app.use(express.static('public'));



app.listen(port, () => {
  console.log(`Audible title service listening at http://localhost:${port}`);
});