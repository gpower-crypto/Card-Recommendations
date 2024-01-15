const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.post("/getCreditCardRecommendation", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res
      .status(400)
      .json({ error: "Missing user query in the request body." });
  }

  const command = `node cardRecommendationLogic.js "${query}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).json({ error: "Internal server error." });
    }

    const response = JSON.parse(stdout.trim());
    return res.json(response);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
