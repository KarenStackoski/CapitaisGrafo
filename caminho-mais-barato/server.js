const express = require('express');
const cors = require('cors');
const Graph = require('./src/graph');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const graph = new Graph();
graph.loadFromJSON('./capitais.json');

app.get('/capitais', (req, res) => {
  res.json(Object.keys(graph.vertices));
});

app.post('/rota', (req, res) => {
  const { origem, destino, precoCombustivel, autonomia } = req.body;
  const result = graph.findCheapestPath(origem, destino, Number(precoCombustivel), Number(autonomia));

  if (!result) {
    res.status(404).json({ error: 'Rota não encontrada.' });
  } else {
    res.json(result);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});