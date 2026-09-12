import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Result from './components/Result'
import Country from './components/Country'
import Weather from './components/Weather'
import countriesService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setFilter] = useState('')
  const [cityWeather, setCityWeather] = useState(null)

  const handleShowCountryClick = (countryName) => {
    setFilter(countryName)
  }

  const handleFilterChange = (event) => {
    setCityWeather(null)
    setFilter(event.target.value)
  }


  const filteredCountries = newFilter.length === 0
    ? []
    : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLocaleLowerCase()))

  useEffect(() => {
    if (newFilter.length === 0) {
      countriesService
        .getAll()
        .then(allCountries => {
          setCountries(allCountries)
        })
    }

    if (filteredCountries.length === 1) {
      weatherService
        .getWeather(filteredCountries[0].capital[0])
        .then(cityWeather => {
          setCityWeather(cityWeather)
        })
    }

  }, [newFilter])

  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Result results={filteredCountries} onShowClick={handleShowCountryClick} />
      <Country countries={filteredCountries} />
      <Weather cityWeather={cityWeather} />
    </div>
  )
}

export default App