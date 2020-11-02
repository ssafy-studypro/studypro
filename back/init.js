import app from "./app";
import fs from "fs";
import { connect, server } from "./socket";

const PORT = 8000;
const SOCKET_PORT = 8210;

const option = {
  key: fs.readFileSync("./keys/private.key"),
  cert: fs.readFileSync("./keys/certificate.crt"),
  ca: fs.readFileSync("./keys/ca_bundle.crt"),
};

const https_app = require("https").createServer(option, app);
const handleListening = () => {
  console.log(`✅  Listening on : https://localhost:${PORT} ✌`);
  // connect()
};

https_app.listen(PORT, handleListening);

server.listen(SOCKET_PORT, function () {
  connect();
});
