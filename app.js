const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const app = express();

const { contactsRouter } = require("./routes/api/contactsRouter");
const { authRouter } = require("./routes/api/authRouter");
const { avatarsRouter } = require("./routes/api/avatarsRouter");

const { connectMongo } = require("./src/db/connection");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const PORT = process.env.PORT || 8083;

app.use(logger(formatsLogger));
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);
app.use("/avatars", authRouter);
// app.use("/avatars", avatarsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, (error) => {
      if (error) {
        console.log("Error at server launch: ", error);
      }
      console.log(`Database connection successfull!`);
    });
  } catch (error) {
    console.error(`Failed to launch with error: ${error.message}`);
    process.exit(1);
  }
};
start();

module.exports = app;
