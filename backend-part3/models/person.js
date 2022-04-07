const mongoose = require("mongoose")
const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const numberValidator = function(v) {
  return /^\d{2,3}-\d+/.test(v)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [ 3, "must be at least 3 chars long" ],
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: [ numberValidator, "must be in following format: 09-123456789 or 040-1234567" ]
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)