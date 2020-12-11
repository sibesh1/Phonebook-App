const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//const Contact = mongoose.model("Contact", contactSchema);

module.exports = mongoose.model("Contact", contactSchema);

// const contact = new Contact({
//   name: "Tommy Singh",
//   number: "8363725",
// });

/*Contact.find({}).then((result) => {
  result.forEach((contact) => {
    console.log(contact);
  });
  mongoose.connection.close();
});*/

// contact.save().then((result) => {
//   console.log("contact saved!");
//   mongoose.connection.close();
// });
