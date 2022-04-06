/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react"
import { PersonForm, Persons, FilterPersons } from "./components/Persons"
import Notification from "./components/Notification"
import personsService from "./services/persons"

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [notification, setNewNotification] = useState("")
  const [notificationIsError, toggleNotificationIsError] = useState(false)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleNewName = (e) => setNewName(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)

  const filteredPersons = newFilter 
  ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())) 
  : persons

  const handleFilter = (e) => {
    setNewFilter(e.target.value)
  }

  const handleDelete = (person) => {    
    const message = `Delete \"${person.name}\"?`
    const result = window.confirm(message)

    if (result) {
      personsService
        .remove(person.id)
        .then(getAll => setPersons(getAll))
        .catch(error => {
          setNewNotification(`\"${person.name}\" has already been removed from server.`)
          setTimeout(() => setNewNotification(""), 3000)
          toggleNotificationIsError(true)
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const addPerson = (e) => {
    e.preventDefault()

    // if person already exists, ask user to confirm number update
    const personExists = persons.some(person => person.name === newName)
    
    if (personExists) {
      const result = window.confirm(
        `\"${newName}\" has already been added to the phonebook, replace the old number with a new one?`
      )

      //if number update is confirmed, add number to existing person object and render view 
      if (result) {
        const personToUpdate = persons.find(person => person.name === newName)
        const changedPerson = { ...personToUpdate, number: newNumber }

        personsService
          .update(personToUpdate.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.id !== personToUpdate.id
              ? person
              : returnedPerson
            ))
          })
          .catch(error => {
            setNewNotification(`\"${personToUpdate.name}\" has already been removed from server.`)
            setTimeout(() => setNewNotification(""), 3000)
            toggleNotificationIsError(true)
            setPersons(persons.filter(p => p.id !== personToUpdate.id))
          })
      }

      setNewName("")
      setNewNumber("")
      return
    }

    // if person does NOT already exist, add them to persons list
    const personObj = {
      name: newName,
      number: newNumber,
    }

    personsService
      .create(personObj)  
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")

        setNewNotification(`\"${returnedPerson.name}\" has been added to phonebook.`)
        setTimeout(() => setNewNotification(""), 5000)
        toggleNotificationIsError(false)
      })
      .catch(error => {
        console.log(error.response.data);
        setNewNotification(`${error.response.data.error}`)
        setTimeout(() => setNewNotification(""), 5000)
        toggleNotificationIsError(true)
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      
        <h2>Search</h2>
          <div>
            <FilterPersons 
              newFilter={newFilter} 
              handleFilter={handleFilter} 
            />
          </div>
  
        <h2>Add person</h2>
          <div>
            <PersonForm 
              addPerson={addPerson} 
              newName= {newName} 
              handleNewName={handleNewName} 
              newNumber={newNumber} 
              handleNewNumber={handleNewNumber} 
            />
          </div>
 
        <h2>Numbers</h2>
          <Notification 
            notification={notification} 
            notificationIsError={notificationIsError} />

          <ul>
            <Persons 
              persons={filteredPersons}
              handleDelete={handleDelete} 
            />
          </ul>
        
    </div>
  )
}

export default App