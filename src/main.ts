import { createServer } from 'http';

const port = Number(process.env.PORT) || 3001;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    ok: true,
    url: req.url,
    port,
  }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Plain Node server running on port ${port}`);
});