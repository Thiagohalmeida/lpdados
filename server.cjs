const express = require('express');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(cors());

const bigquery = new BigQuery({
  projectId: 'worlddata-439415',
  keyFilename: '/etc/secrets/keyfile.json',
});

app.get('/docs', async (req, res) => {
  try {
    const query = 'SELECT * FROM `worlddata-439415.lpdados.docs`';
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    console.error('Erro na consulta BigQuery:', error);
    res.status(500).json({ error: 'Erro ao consultar BigQuery' });
  }
});

app.get('/pesquisas', async (req, res) => {
  try {
    const query = 'SELECT * FROM `worlddata-439415.lpdados.pesquisas`';
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    console.error('Erro na consulta BigQuery:', error);
    res.status(500).json({ error: 'Erro ao consultar BigQuery' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
