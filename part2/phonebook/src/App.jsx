import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const duplicatedPerson = persons.find(person => person.name === newName)

    if (duplicatedPerson !== undefined) {
      if (confirm(`${duplicatedPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const personCopy = { ...duplicatedPerson }
        personCopy.number = newNumber

        personService
          .update(personCopy)
          .then(createPerson => {
            duplicatedPerson.number = createPerson.number
            setErrorMessage(
              `Updated number ${createPerson.number} for ${createPerson.name}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setNewName('')
            setNumber('')
          }).catch(error => {
            setErrorMessage(
              `Information of ${createPerson.name} has aleredy been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })

      } else {
        setNewName('')
        setNumber('')
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(createPerson => {
          setErrorMessage(
            `Added ${createPerson.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.concat(createPerson))
          setNewName('')
          setNumber('')
        }).catch(error => {
          setErrorMessage(
            `Information of ${createPerson.name} has aleredy been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleDeletePersonClick = (person) => {
    if (confirm(`Delete ${person.name}`)) {
      const userId = person.id
      personService
        .deletePerson([userId])
        .then(_ => {
          setPersons(persons.filter(person => person.id != userId))
        }).catch(error => {
          setErrorMessage(
            `Information of ${person.name} has aleredy been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
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
      <Notification message={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm newNumber={newNumber} newName={newName} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filteredPerson} onDeleteClick={handleDeletePersonClick} />
    </div>
  )
}

export default App