const Result = ({ results, onShowClick }) => {
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
          {country.name.common} <button onClick={() => onShowClick(country.name.common)}>Show</button>
        </div>
      )}
    </>
  )
}

export default Result