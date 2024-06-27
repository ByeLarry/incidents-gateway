import dotenv from "dotenv";
import app from "./app";
import testRouter from "./routes/test.route";
dotenv.config();

app.use("/test", testRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
