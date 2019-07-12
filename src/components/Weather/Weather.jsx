import React from 'react';
import './Weather.scss';
// import WeatherIcons from 'react-weathericons';
// import { WiDaySunny } from 'weather-icons-react';
import 'weather-icons/css/weather-icons.css'
import weatherIcons from "./icons.js";

export class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weatherData: {},
        };
        this.renderCityWeather = this.renderCityWeather.bind(this);
    }

    renderCityWeather(weatherData) {
        console.log(weatherData);
        let prefix = 'wi wi-';
        let weatherClass = "";
        if (weatherData && weatherData.weather) {
            let code = weatherData.weather[0].id;
            // / If we are not in the ranges mentioned above, add a day/night prefix.
            let icon = weatherIcons[code].icon;
            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                icon = 'day-' + icon;
            }
            let weatherClass = prefix + icon;
            return (
                <div>
                    <i className={weatherClass}></i>
                    <h2> {weatherData.name}</h2>
                    <h2> {weatherData.main.grnd_level}</h2>
                    <h2> {weatherData.main.sea_level}</h2>
                    <h2> {weatherData.main.humidity}</h2>
                    <h2> {weatherData.main.pressure}</h2>
                    <h2> {weatherData.main.temp}</h2>
                </div>
                // Finally tack on the prefix.


            );
        }

    }

    render() {
        return (
            <div className="glass">
                <div className="weather">
                    {this.renderCityWeather(this.props.weatherData)}
                </div>
            </div>
        )
    }
}
