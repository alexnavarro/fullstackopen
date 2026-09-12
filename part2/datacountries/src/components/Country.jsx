const Country = ({ countries }) => {
    if (countries.length !== 1) {
        return null
    }

    let country = countries[0]
    let languages = Object.entries(country.languages)


    return (
        <>
            <h1>{country.name.common}</h1>

            <div>Capital {country.capital.join(',')}</div>
            <div>Area {country.area}</div>

            <h2>Languages</h2>
            <ul>
                {languages.map(([key, language]) =>
                    <li key={key}>{language}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
        </>
    )
}

export default Country