const express = require("express");
const app = express();
const data = require("./data");
const longProcess = require("./long-process");

const timeout = require("connect-timeout");

app.use(express.static("./methods-public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/people", (req, res) => {
  res.status(200).json({ data: data.people });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.status(201).send("POST");
});

app.post("/api/people", timeout("4s"), async (req, res) => {
  try {
    // if (req.timedout) {
    //   res.status(408).json({ success: false, msg: "Process timed out" });
    //   throw new Error("Function timeout!");
    // }
    const { name } = await req.body;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide name value" });
    } else if (name === "long") {
      await longProcess(req, res);
    }
    return res.status(201).json({ success: true, person: name });
  } catch (error) {
    console.log("Error occured with POST request: ", error);
  }
});
app.listen(3000, () => {
  console.log("listening server");
});
