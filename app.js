const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const { hashPassword, verifyPassword, verifyToken, userIsAllowed } = require("./auth.js");

const { validateUser } = require("./validators.js");
const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser); // Modifier le validator pour le password

const { validateMovie } = require("./validators.js");
const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword);

app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

app.put("/api/users/:id", userIsAllowed, validateUser, hashPassword, userHandlers.updateUser); // Modifier le validator pour le password
app.delete("/api/users/:id", userIsAllowed, userHandlers.deleteUser);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
