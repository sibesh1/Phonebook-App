const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Contact = require("./models/mongo");

//MIDDLEWARE
const app = express();
app.use(express.json());
app.use(cors()); //CORS validation
app.use(express.static("build")); //Frontend Page

//DEFAULT DATA
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-525325",
  },
  {
    id: 3,
    name: "Dan Abramove",
    number: "12-43-23435",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "29-23-123456",
  },
];

//Intro Page

app.get("/info", (request, response) => {
  response.send(
    "<h3>This Phonebook has info on 4 people by default.You can add or delete any contact as per your wish.</h3>"
  );
});

//GET REQUESTS
app.get("/api/persons", (request, response) => {
  Contact.find({}).then((note) => {
    response.json(note);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

//POST REQUESTS
const contactscontain = (name) => {
  let flag = false;
  persons.map((p) => {
    if (p.name.toLowerCase() === name.toLowerCase()) {
      flag = true;
    }
  });
  return flag;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number missing",
    });
  }

  if (contactscontain(body.name)) {
    return response.status(400).json({
      error: "Name already in phonebook",
    });
  }

  const person = new Contact({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedContact) => {
    response.json(savedContact);
  });
});

//DELETE REQUESTS
app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//ERROR HANDLING
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
