const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  "/speedtest/upload",
  express.raw({ type: "*/*", limit: "200mb" })
);


app.get("/speedtest/download", (req, res) => {
  const sizeParam = Number(req.query.size);
  const size = Number.isFinite(sizeParam) && sizeParam > 0 ? sizeParam : 5 * 1024 * 1024;
  const chunk = Buffer.alloc(64 * 1024, "a");
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Length", String(size));

  let remaining = size;
  while (remaining > 0) {
    const toSend = remaining >= chunk.length ? chunk : chunk.subarray(0, remaining);
    res.write(toSend);
    remaining -= toSend.length;
  }
  res.end();
});

app.post("/speedtest/upload", (req, res) => {
  let bytes = 0;
  req.on('data', chunk => { bytes += chunk.length; });
  req.on('end', () => res.json({ receivedBytes: bytes }));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`speedtest server listening on ${port}`);
});
