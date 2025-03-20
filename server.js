const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const connectDB = require("./config/database");
const app = require("./app");

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`server is working on:  http://localhost:${port}`);
});
