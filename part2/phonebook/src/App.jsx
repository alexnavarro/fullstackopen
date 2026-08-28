import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from '../../courseinfo/src/components/PersonForm'
import Persons from '../../courseinfo/src/components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')

   useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log(event.target.form);

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    }

    console.log(personObject);


    setPersons(persons.concat(personObject))
    setNewName('')
    setNumber('')
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPerson = newFilter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm newNumber={newNumber} newName={newName} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filteredPerson} />
    </div>
  )
}

export default App