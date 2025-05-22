import type { NextApiRequest, NextApiResponse } from 'next';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';

const bigquery = new BigQuery({
  projectId: 'worlddata-439415',
  keyFilename: path.join(process.cwd(), 'worlddata-439415-411820218e43.json'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = 'SELECT * FROM `worlddata-439415.lpdados.docs`';
    const options = { query };

    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao consultar BigQuery:', error);
    res.status(500).json({ error: 'Erro ao consultar BigQuery' });
  }
}
