import React from 'react';
import './Weather.scss';
import weatherIcons from "./icons.js";
import {Request} from "../../request";
import {Redirect} from "react-router-dom";

export class Weather extends React.Component {
    constructor(props) {
        super(props);

        this.openWeatherAPIkey = 'e73aa676cc2784957fb2970f1004a9e1';
        this.state = {
            weatherData: "",
            forecastData: "",
            isFavourite: false,
            cityName: "",
            latitude: null,
            longitude: null,
            type: ""
        };
        this.renderCityWeather = this.renderCityWeather.bind(this);
        this.fetchWeather = this.fetchWeather.bind(this);
        this.fetchWeatherByCoordinates = this.fetchWeatherByCoordinates.bind(this);
        // this.callbackFetchWeather = this.callbackFetchWeather.bind(this);
        // this.fetchWeatherByCoordinates();
    }

    fetchWeather(cityName, type) {
        // debugger;
        // const type = this.props.type;
        // const type = 'weather';
        // let queryString = this.props.match.params.queryString;
        // let cityName = this.state.cityName;
        // let queryParam = queryString.parse(this.props.location.search);
        let request = {};
        let weatherData = {};
        console.log("WEATHER: QUERY city name: ", cityName);
        console.log(this.state);
        if (cityName !== undefined && cityName !== "Coordinates" && cityName !== "" && type !== undefined) {
            console.log("WEATHER: BY NAME");
            request = new Request(`http://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&APPID=${this.openWeatherAPIkey}`)
            console.log("WEATHER: request name: ", `http://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&APPID=${this.openWeatherAPIkey}`)
            if (request) {
                request.get(undefined,
                    (weatherDataJSON) => {
                        weatherData = JSON.parse(weatherDataJSON);
                        if (weatherData.cod === 200 || weatherData.cod === "200") {
                            this.setWeather(weatherData, type);
                            // if (type === 'weather') {
                            // this.props.updateCurrentCity('name', weatherData.name);
                            // this.props.setFavouriteState(cityName)
                            // }
                        } else if (weatherData.cod === 404 || weatherData.cod === "404") {
                            console.log(weatherData.cod)
                            return (
                                <Redirect to={`/404}`}/>
                            )
                        }
                    },
                    (e) => {
                        console.log("Weather: ", e);
                    },
                    {})
            }
            // } else {
            //     this.fetchWeatherByCoordinates(type);
        }
    }

    fetchWeatherByCoordinates(type) {
        if (type) {
            console.log("WEATHER: Coordinates!");
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log("WEATHER: coord", position);
                    this.setState({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            error: null
                        }, () => {
                            let myLat = `${this.state.latitude}`;
                            let myLon = `${this.state.longitude}`;

                            let request = new Request(`http://api.openweathermap.org/data/2.5/${type}?lat=${myLat}&lon=${myLon}&units=metric&appid=${this.openWeatherAPIkey}`);
                            console.log("WEATHER: request coord: ", `http://api.openweathermap.org/data/2.5/${type}?lat=${myLat}&lon=${myLon}&units=metric&appid=${this.openWeatherAPIkey}`)
                            if (request) {
                                console.log('coord', request);
                                request.get(undefined,
                                    (weatherDataJSON) => {
                                        const weatherData = JSON.parse(weatherDataJSON);
                                        if (weatherData.cod === 200 || weatherData.cod === "200") {
                                            this.setWeather(weatherData, type);
                                            console.log("WEATHER: fetchWeathercoord:", this.state);
                                            console.log("WEATHER: fetchWeathercoord:", weatherData);
                                            if (type === 'weather') {
                                                this.setState({'cityName': weatherData.name}, this.setCityName);
                                                // debugger
                                                // this.props.updateCurrentCity('name', weatherData.name);
                                                // this.fetchPhoto(weatherData.name);
                                                // this.props.setFavouriteState(weatherData.name)
                                            }
                                        } else if (weatherData.cod === 404 || weatherData.cod === "404") {
                                            console.log(weatherData.cod)
                                            return (
                                                <Redirect to={`/404}`}/>
                                            )
                                        }
                                    },
                                    (e) => {
                                        console.log(e);
                                    },
                                    {})
                            }
                        }
                    );
                },
                error => this.setState({error: error.message}),
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                    distanceFilter: 5
                }
            );
        }
    }

    setWeather(weatherData, type) {
        if (type === 'weather') {
            this.setState({weatherData})
        } else if (type === 'forecast') {
            this.setState({forecastData: weatherData})
        }
    }

    renderCityWeather() {
        let weatherData = this.state.weatherData;
        let prefix = 'wi wi-';
        // let weatherClass = "";
        console.log("WEATHER: rendercityWeather", this.props);
        if (weatherData && weatherData.weather) {
            const code = weatherData.weather[0].id;
            // / If we are not in the ranges mentioned above, add a day/night prefix.
            let icon = weatherIcons[code].icon;
            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
                icon = 'day-' + icon;
            }
            let weatherClass = prefix + icon;
            return (
                <div className='weather-container'>
                    <i className={weatherClass}></i>
                    <div className='weather-text'>
                        <div className='weather-header'> {weatherData.name}</div>
                        <ul>
                            {weatherData.main.temp > 0 ? <li> Температура {Math.floor(weatherData.main.temp)} &deg;C</li> : <li/>}
                            {weatherData.main.pressure >0 ? <li>Давление {weatherData.main.pressure}</li> : <li/>}
                            {weatherData.main.sea_level > 0 ? <li>Уровень моря {weatherData.main.sea_level}</li> : <li/> }
                            <li>Влажность {weatherData.main.humidity}</li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            this.cityNameUpdated(this.props.currentCity.name)
        }

    }


    handleFavouriteToggle = () => {
        let isFavourite = !this.state.isFavourite;
        this.props.appendFavouriteCity(isFavourite);
        this.setState({isFavourite});
    };

    // callbackFetchWeather(type) {
    //     return this.fetchWeather(type)
    // };
    setCityName = () => {
        this.props.updateCurrentCity('name', this.state.cityName)
    };

    cityNameUpdated = (cityName) => {
        console.log("WEATHER: cityname", cityName);
        if (cityName !== this.state.cityName && cityName !== 'Coordinates') {
            // callback working immiditialy not after set state
            console.log("WEATHER:Receive props name", cityName, this.state.cityName)
            // this.setState({cityName}, this.callbackFetchWeather(this.props.type))  //TODO check use state or props for type
            this.setState({cityName})  //TODO check use state or props for type
        } else if (cityName !== this.state.cityName && cityName === 'Coordinates') {
            console.log("WEATHER: Receive props coordinates", cityName, this.state.cityName)
            this.fetchWeatherByCoordinates(this.props.type);
        }
    };

    componentWillReceiveProps(nextProps, nextState, nextContext) {
        console.log("WEATHER: receive props", nextProps, this.props)
        if (nextProps.currentCity.name !== this.props.currentCity.name) {
            console.log("___>>>")
            this.cityNameUpdated(nextProps.currentCity.name);
            this.setState({isFavourite: this.props.isFavourite});
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // this.fetchWeather(this.props.type)
        console.log("WEATHER: receive props", nextProps, this.props)
        console.log("WEATHER: will update state", nextState, this.state)
        if (nextState.cityName === 'Coordinates') {
            this.fetchWeatherByCoordinates(this.props.type)
        } else if (nextState.cityName !== this.state.cityName) {
            this.fetchWeather(nextState.cityName, this.props.type)
        }
    }

    render() {
        console.log("WEATHER: render", this.props);
        let classFavourite = this.props.isFavourite ?  "plus__activated": "plus";
        // debugger
        return (

            <div className="weather">
                {this.renderCityWeather()}
                {/*    <h2>Hover me </h2>*/}
                    <button className={classFavourite} onClick={this.handleFavouriteToggle}></button>
                {/*<button className={classFavourite}*/}
                {/*        onClick={this.handleFavouriteToggle}>*/}
                {/*</button>*/}
            </div>
        )
    }
}

// style={this.props.isFavourite ? {backgroundColor: "yellow"} : {backgroundColor: "transparent"}}
