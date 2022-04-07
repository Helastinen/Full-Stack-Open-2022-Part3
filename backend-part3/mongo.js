const mongoose = require("mongoose")
const password = process.argv[2]
const url = `mongodb+srv://Full-Stack-Open-2022:${password}@cluster0.srrrn.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// verify argument amount
if ( process.argv.length <= 2 || process.argv.length === 4 || process.argv.length >= 6) {
  console.log("Please provide correct amount of arguments: three `node mongo.js <password>` or five `node mongo.js <password> <name> <number>`")
  process.exit(1)
}
else {
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model("Person", personSchema)

  // add person to collection
  if ( process.argv.length === 5 ) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person
      .save()
      .then(() => {
        console.log(`Added ${process.argv[3]} ${process.argv[4]} into phonebook`)
        mongoose.connection.close()
      })
  }

  // search people of collection
  else if ( process.argv.length === 3 ) {
    Person
      .find({})
      .then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }
}

