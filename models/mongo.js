require("dotenv").config();
const mongoose = require("mongoose");
const pass = process.env.REACT_APP_PASS;
const url = `mongodb+srv://sibesh:${pass}@cluster0.dfjse.mongodb.net/phonebook?retryWrites=true&w=majority`;

console.log("trying to connect", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: { type: String, minlength: 1, required: true },
  number: { type: String, minlength: 1, required: true },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
