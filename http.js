import { createServer } from "http";
import { stat, createReadStream } from "fs";
import { promisify } from "util";
const filename = "./public/My_Moon.mp3";
const fileInfo = promisify(stat);

createServer(async (req, res) => {
  const { size } = await fileInfo(filename);
  const range = req.headers.range;

  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "audio/mpeg",
    });
  } else {
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "audio/mpeg",
    });
  }
  createReadStream(filename).pipe(res);
}).listen(3000, () => console.log("Server running - 3000"));
