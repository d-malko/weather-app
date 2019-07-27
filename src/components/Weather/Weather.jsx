import React from 'react';
import './Weather.scss';
// import 'weather-icons/css/weather-icons.css'
import weatherIcons from "./icons.js";
import queryString from "query-string";
import {Request} from "../../request";

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
        if (cityName !== undefined && cityName !== "coordinates" && cityName !== "" && type !== undefined) {
            console.log("WEATHER: BY NAME");
            request = new Request(`http://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&APPID=${this.openWeatherAPIkey}`)
            console.log("WEATHER: request name: ", `http://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&APPID=${this.openWeatherAPIkey}`)
            if (request) {
                request.get(undefined,
                    (weatherDataJSON) => {
                        weatherData = JSON.parse(weatherDataJSON);
                        if (weatherData.cod === 200 || weatherData.cod === "200") {
                            this.setWeather(weatherData, type);
                            if (type === 'weather') {
                                // this.props.updateCurrentCity('name', weatherData.name);
                                this.props.setFavouriteState(cityName)
                            }
                            // } else {
                            //     this.fetchWeatherByCoordinates(type);
                        }
                    },
                    (e) => {
                        console.log(e);
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
                                                this.setState({'cityName': weatherData.name}, this.props.updateCurrentCity('name', weatherData.name));
                                                // debugger
                                                // this.props.updateCurrentCity('name', weatherData.name);
                                                // this.fetchPhoto(weatherData.name);
                                                // this.props.setFavouriteState(weatherData.name)
                                            }
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
        if (weatherData && weatherData.weather) {
            const code = weatherData.weather[0].id;
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
                    <h2> {weatherData.main.temp}</h2>
                    <h2> {weatherData.main.pressure}</h2>
                    <h2> {weatherData.main.grnd_level}</h2>
                    <h2> {weatherData.main.sea_level}</h2>
                    <h2> {weatherData.main.humidity}</h2>
                </div>
            );
        }

    }


    handleFavouriteToggle = () => {
        let favour = !this.state.isFavourite;
        this.props.appendFavouriteCity(favour);
        this.setState({isFavourite: favour});
    };

    // callbackFetchWeather(type) {
    //     return this.fetchWeather(type)
    // };

    cityNameUpdated = (cityName) => {
        console.log("WEATHER: cityname", cityName);
        if (cityName !== this.state.cityName && cityName !== 'coordinates') {
            // callback working immiditialy not after set state
            console.log("WEATHER:Receive props name", cityName, this.state.cityName)
            // this.setState({cityName}, this.callbackFetchWeather(this.props.type))  //TODO check use state or props for type
            this.setState({cityName})  //TODO check use state or props for type
        } else if (cityName !== this.state.cityName && cityName === 'coordinates') {
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
        if (nextState.cityName === 'coordinates') {
            this.fetchWeatherByCoordinates(this.props.type)
        } else if (nextState.cityName !== this.state.cityName) {
            this.fetchWeather(nextState.cityName, this.props.type)
        }
    }

    render() {
        return (
            <div className="glass">
                <div className="weather">
                    {this.renderCityWeather()}
                    <button className='favouriteBtn'
                            style={this.props.isFavourite ? {backgroundColor: "yellow"} : {backgroundColor: "transparent"}}
                            onClick={this.handleFavouriteToggle}>
                        favourites
                    </button>

                </div>
            </div>
        )

    }
}
