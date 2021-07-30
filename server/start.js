require('newrelic');
const app = require('./index.js');
const port = 2002;

app.listen(port, () => {
  console.log(`Audible title service listening at http://localhost:${port}`);
});