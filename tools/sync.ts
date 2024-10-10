#!/usr/bin/env ts-node

import { writeFileSync } from 'fs';
import { ofetch } from 'ofetch';

async function saveApi() {
  ;(await import('dotenv')).config({ path: '.yapirc' });

  const token = process.env.YAPI_TOKEN;
  if (!token) {
    console.log('Yapi token not found!');
    return;
  }
  const filePath = __dirname + '/swagger.json';
  const baseUrl
    = 'https://yapi.abmatrix.cn/api/plugin/exportSwagger?type=OpenAPIV2&pid=96&status=all&isWiki=false&token=';
  const api = await ofetch(baseUrl + token, { parseResponse: JSON.parse });
  writeFileSync(filePath, JSON.stringify(api));
  console.info('🎉  Yapi sync successfully');
}

try {
  saveApi();
}
catch (err) {
  console.log(err);
}
