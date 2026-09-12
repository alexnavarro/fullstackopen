const Weather = ({ cityWeather }) => {
    if (cityWeather == null) {
        return null
    }

    const weatherIconUrl = `https://openweathermap.org/payload/api/media/file/${cityWeather.weather[0].icon}.png`

    return (
        <>
            <h2>Weather in {cityWeather.name}</h2>
            <p> Temperature {cityWeather.main.temp} Celsius</p>
            <img src={weatherIconUrl} alt='Icon representing weather' />
            <p>Wind {cityWeather.wind.speed} m/s</p>
        </>
    )
}

export default Weather