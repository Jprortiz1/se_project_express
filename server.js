// server.js
const app = require('./app');
const { PORT } = require('./utils/config');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
