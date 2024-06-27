import express from "express";
import morgan from "morgan";
import path from "path";
import fs from "fs";

const app = express();

var accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log"),
  {
    flags: "a",
  }
);
app.use(morgan("combined", { stream: accessLogStream }));

export default app;
