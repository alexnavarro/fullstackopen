const Result = ({ results }) => {
  if (results === null || results.length === 1) {
    return null
  }

  if (results.length > 10) {
    return (
      <div>
        To many matches, specify another filter
      </div>
    )
  }

  return (
    <>
      {results.map(country =>
        <div key={country.cca2}>
          {country.name.common}
        </div>
      )}
    </>
  )
}

export default Result