const express = require('express');
const cors = require('cors');
const mazeRoutes = require('./src/routes/mazeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', mazeRoutes);

module.exports = app;