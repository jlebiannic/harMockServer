//const harData = require("./localhost.har.json");
//console.log(harData);

// These lines make "require" available
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

import { HarMockUtil } from "./HarMockUtil.js";
import express from "express";
import fs from "fs";
//import bodyParser from "body-parser";

const app = express();
//const path = require("path");

app.use(express.json());

// parse application/json
//app.use(bodyParser.json());

let harData;
try {
  harData = JSON.parse(fs.readFileSync("./localhost_Archive.har", "utf8"));
  console.log(harData.log.version);
} catch (err) {
  console.error(err);
}

app.get("/health", (req, res) => {
  console.log("OK");
  res.send("OK");
});

app.all("/*", (req, res) => {
  if (harData) {
    console.log("*********************************************************");
    const mockResponse = HarMockUtil.getMockResponse(req, harData);
    console.log("mockResponse", mockResponse);
    res.send(HarMockUtil.getContentText(mockResponse));
  } else {
    console.log("/*");
    console.log("body: ", req.body);
    if (req.body && req.method === "POST") {
      res.send("***body: " + req.body.test);
    } else {
      res.send("***" + req.method + ": " + req.originalUrl);
    }
  }
});

app.listen(80, () => {
  console.log("Server up and running on port 80");
  // console.log(__dirname);
});
