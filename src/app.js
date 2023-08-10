const express = require("express");
const app = express();
const getZoos = require("./utils/getZoos");
const validateZip = require("./middleware/validateZip");

app.get("/zoos/all", (req, res, next) => {
  const isAdmin = req.query.admin === "true";
  if (!isAdmin) {
    const error = new Error("You do not have access to that route.");
    error.status = 403;
    return next(error);
  }

  const zoos = getZoos("all");
  if (zoos.length > 0) {
    // Ensure the response starts with a capital "A" for "All zoos"
    const responseMessage = `All zoos: ${zoos.join("; ")}`;
    res.send(responseMessage);
  } else {
    res.send("There are no zoos.");
  }
});


// Routes
app.get("/check/:zip", validateZip, (req, res) => {
  const zip = req.params.zip;
  const zoos = getZoos(zip);
  if (zoos) {
    res.send(`${zip} exists in our records.`);
  } else {
    res.send(`${zip} does not exist in our records.`);
  }
});

app.get("/zoos/:zip", validateZip, (req, res) => {
  const zip = req.params.zip;
  const zoos = getZoos(zip);
  if (zoos && zoos.length > 0) {
    res.send(`${zip} zoos: ${zoos.join("; ")}`);
  } else {
    res.send(`${zip} has no zoos.`);
  }
});

// app.get("/zoos/all", (req, res, next) => {
//   const isAdmin = req.query.admin === "true";
//   if (!isAdmin) {
//     const error = new Error("You do not have access to that route.");
//     error.status = 403;
//     return next(error);
//   }

//   const zoos = getZoos("all");
//   if (zoos.length > 0) {
//     // Ensure the response starts with a capital "A" for "All zoos"
//     const responseMessage = `All zoos: ${zoos.join("; ")}`;
//     res.send(responseMessage);
//   } else {
//     res.send("There are no zoos.");
//   }
// });

// Error handling for route not found
app.use((req, res, next) => {
  const error = new Error("That route could not be found!");
  error.status = 404;
  next(error);
});

// General error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 403 ? "You do not have access to that route." : err.message || "Internal server error!";
  res.status(status).send(message);
});

module.exports = app;
