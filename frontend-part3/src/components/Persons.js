const PersonForm = ({ addPerson, newName, handleNewName, newNumber, handleNewNumber }) => {
  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    persons.map(person => 
      <li key={person.id} className="person">
        {person.name} - {person.number} <button onClick={() => handleDelete(person)}>Delete</button>
      </li>
    )
  )
}

const FilterPersons = ({ newFilter, handleFilter }) => {
  return(
    <div>
      Filter people by name: <input value={newFilter} onChange={handleFilter} />
    </div>
  ) 
} 

export { PersonForm, Persons, FilterPersons }