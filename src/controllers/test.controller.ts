import express from "express";

export const testController = (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
};
