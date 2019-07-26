import React from 'react';
import queryString from 'query-string';
import _ from "lodash";

import {Background} from "../Background";
import {Weather} from "../Weather";

import {Request} from "../../request";
import {FavouritesSlider} from "../FavouritesSlider";
import 'weather-icons/css/weather-icons.css'
import './Home.scss'

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.openWeatherAPIkey = 'dcadc5c4c9a9cbaa47c897672f8a7ed1';
        this.unsplashAPIkey = '942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d';


        this.state = {
            weatherData: {},
            forecastData: {},
            queryParam: "",
            cityPhotos: {},
            currentPage: 1,
            cityName: "",
            isLoading: true,
            latitude: null,
            longitude: null,
            error: null,
            isFavourite: false,
            currentCity: {
                name: "",
                src: "",
                bigImage: ""
            },
            favourites: [],
        };
        this.searchHandler = this.searchHandler.bind(this);
        this.setWeather = this.setWeather.bind(this);
        this.favouriteHandle = this.favouriteHandle.bind(this);
        this.fetchPhoto = this.fetchPhoto.bind(this);
        this.setFavouriteState = this.setFavouriteState.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);


    }

    setWeather(weatherData, type) {
        if (type === 'weather') {
            this.setState({weatherData})
        } else if (type === 'forecast') {
            this.setState({forecastData: weatherData})
        }

    }

    setCityPhotos(cityPhotos) {
        this.setState({cityPhotos})
        // debugger
    }


    fetchWeather(type) {
        let queryParam = queryString.parse(this.props.location.search);
        let request = {};
        let weatherData = {};
        if (undefined !== queryParam.name) {

            request = new Request(`http://api.openweathermap.org/data/2.5/${type}?q=${queryParam.name}&units=metric&APPID=${this.openWeatherAPIkey}`);
            if (request) {
                request.get(undefined,
                    (weatherDataJSON) => {
                        weatherData = JSON.parse(weatherDataJSON);

                        if (weatherData.cod === 200 || weatherData.cod === "200" ) {
                            this.setWeather(weatherData, type);
                            if (type === 'weather'){
                                this.updateCurrentCity('name', weatherData.name);
                                this.fetchPhoto(weatherData.name);
                                this.setFavouriteState(weatherData.name)
                            }
                            }
                    },
                    (e) => {
                        console.log(e);
                    },
                    {})
            }
        } else if (undefined !== queryParam.coordinates) {
            return this.fetchWeatherByCoordinates();
        }
    }

    fetchWeatherByCoordinates() {
        this.watchId = navigator.geolocation.watchPosition(
            position => {
                this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null
                    }, () => {
                        let myLat = `${this.state.latitude}`;
                        let myLon = `${this.state.longitude}`;
                        let request = new Request(`http://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&units=metric&appid=${this.openWeatherAPIkey}`);
                        if (request) {
                            request.get(undefined,
                                (weatherDataJSON) => {
                                    const weatherData = JSON.parse(weatherDataJSON);
                                    if (weatherData.cod === 200) {
                                        this.setWeather(weatherData);
                                        this.updateCurrentCity('name', weatherData.name);
                                        this.fetchPhoto(weatherData.name);
                                        this.setFavouriteState(weatherData.name);
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

    fetchPhoto(cityName) {
        const request = new Request(`https://api.unsplash.com/search/photos?page=1&query=${cityName}&per_page=5&client_id=${this.unsplashAPIkey}`);
        request.get(undefined,
            (cityPhotosJSON) => {
                const cityPhotos = JSON.parse(cityPhotosJSON) || {};
                this.setCityPhotos(cityPhotos);
                this.updateCurrentCity("src", cityPhotos.results[0].urls.thumb);
                // debugger;
            },
            (e) => {
                console.log(e);
            },
            {})
    }

    setFavouriteState() {
        // console.log('setFavouriteState', this.state)
        if (_.find(this.state.favourites, {name: this.state.currentCity.name})) {
            this.setState({isFavourite: true});

        }
    }

    componentDidMount() {

        if (localStorage.getItem(('favourites'))) {

            const favourites = JSON.parse(localStorage.getItem('favourites'));
            this.setState(
                {favourites: [...favourites]});
            // console.log('start');
            this.fetchWeather('weather');
            this.fetchWeather('forecast');
            // console.log('after fetchWeather');
            this.setFavouriteState()
        }
    }

    searchHandler(weatherData) {
        this.setWeather(weatherData)
    }


    favouriteHandle(favourValue) {
        this.setState({isFavourite: favourValue});
        const cityName = this.state.weatherData.name;
        let favourites = this.state.favourites;
        if (favourValue) {
            if (!_.find(favourites, {name: cityName})) {
                favourites.push(this.state.currentCity);
                this.setState(
                    {favourites: [...favourites]},
                    () => {
                        localStorage.setItem('favourites', JSON.stringify(favourites))
                    }
                )
            }

        } else {
            _.remove(favourites, function (e) {
                return e.name === cityName;
            });
            // debugger
            this.setState(
                {favourites: [...favourites]},
                () => {
                    localStorage.setItem('favourites', JSON.stringify(favourites))
                }
            );
        }

    };

    updateCurrentCity(key, value) {
        this.setState(prevState => {
            let currentCity = Object.assign({}, prevState.currentCity);
            currentCity[key] = value;
            return {currentCity};
        });
        // console.log(this.state.currentCity)
    }

    deleteSlide(cityName) {
        let favourites = this.state.favourites;
        _.remove(favourites, function (e) {
            return e.name === cityName;
        });
        this.setState(
            {favourites: [...favourites]},
            () => {
                localStorage.setItem('favourites', JSON.stringify(favourites))
            }
        )
    }

    render() {
        let weatherParam = {
            weatherData: this.state.weatherData,
            isFavourite: this.state.isFavourite,
            appendFavouriteCity: this.favouriteHandle
        };
        let forecastParam = {
            weatherData: this.state.weatherData,
            isFavourite: this.state.isFavourite,
            appendFavouriteCity: this.favouriteHandle
        };
        // console.log("render.param-->>", weatherParam);
        console.log("render.state-->>", this.state);
        let slidesParam = {
            deleteSlide: this.deleteSlide,
            favourites: this.state.favourites
        };
        // console.log("HOME.slides.param-->>", slidesParam);
        return (
            <div className="App">
                <div className='main'>

                    <Background images={this.state.cityPhotos}/>
                    <Weather {...weatherParam}/>
                    {/*<Weather5days {...forecastParam}/>*/}
                    <FavouritesSlider {...slidesParam}/>

                </div>
            </div>
        );

    }
}