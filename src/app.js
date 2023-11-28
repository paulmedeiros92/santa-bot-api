import 'dotenv/config';
import express from "express";
import router from "./router.js";

const app = express();
app.listen(3000, function() {
  console.log("Server is listening on port 3000...")
});
app.use(router);
