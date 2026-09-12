import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Result from './components/Result'
import Country from './components/Country'
import countriesService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  // const [newName, setNewName] = useState('')
  // const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  // const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(allCountries => {
        setCountries(allCountries)
      })
  }, [])

  // const handleNameChange = (event) => {
  //   setNewName(event.target.value)
  // }

  // const handlePhoneChange = (event) => {
  //   setNumber(event.target.value)
  // }

  // const addPerson = (event) => {
  //   event.preventDefault()

  //   const duplicatedPerson = persons.find(person => person.name === newName)

  //   if (duplicatedPerson !== undefined) {
  //     if (confirm(`${duplicatedPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
  //       const personCopy = { ...duplicatedPerson }
  //       personCopy.number = newNumber

  //       personService
  //         .update(personCopy)
  //         .then(createPerson => {
  //           duplicatedPerson.number = createPerson.number
  //           setErrorMessage(
  //             `Updated number ${createPerson.number} for ${createPerson.name}`
  //           )
  //           setTimeout(() => {
  //             setErrorMessage(null)
  //           }, 5000)
  //           setNewName('')
  //           setNumber('')
  //         }).catch(error => {
  //           setErrorMessage(
  //             `Information of ${createPerson.name} has aleredy been removed from server`
  //           )
  //           setTimeout(() => {
  //             setErrorMessage(null)
  //           }, 5000)
  //         })

  //     } else {
  //       setNewName('')
  //       setNumber('')
  //     }
  //   } else {
  //     const personObject = {
  //       name: newName,
  //       number: newNumber
  //     }
  //     personService
  //       .create(personObject)
  //       .then(createPerson => {
  //         setErrorMessage(
  //           `Added ${createPerson.name}`
  //         )
  //         setTimeout(() => {
  //           setErrorMessage(null)
  //         }, 5000)
  //         setPersons(persons.concat(createPerson))
  //         setNewName('')
  //         setNumber('')
  //       }).catch(error => {
  //         setErrorMessage(
  //           `Information of ${createPerson.name} has aleredy been removed from server`
  //         )
  //         setTimeout(() => {
  //           setErrorMessage(null)
  //         }, 5000)
  //       })
  //   }
  // }

  // const handleDeletePersonClick = (person) => {
  //   if (confirm(`Delete ${person.name}`)) {
  //     personService
  //       .deletePerson([person.id])
  //       .then(deletedPerson => {
  //         setPersons(persons.filter(person => person.id != deletedPerson.id))
  //       }).catch(error => {    
  //         setErrorMessage(
  //           `Information of ${person.name} has aleredy been removed from server`
  //         )
  //         setTimeout(() => {
  //           setErrorMessage(null)
  //         }, 5000)
  //       })
  //   }
  // }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const filteredCountries = newFilter.length === 0
    ? []
    : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLocaleLowerCase()))

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Result results={filteredCountries} />
      <Country countries={filteredCountries} />
    </div>
  )
}

export default App