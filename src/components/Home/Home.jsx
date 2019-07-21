import React from 'react';
import queryString from 'query-string';

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
            queryParam: "",
            cityPhotos: {},
            currentPage: 1,
            cityName: "",
            isLoading: true,
            latitude: null,
            longitude: null,
            error: null,
            favourites: [],
            favourite: false,
            currentCity: {
                name: "",
                smallImage: "",
                bigImage: ""
            },
            slides: localStorage.getItem('slides') || [],
            // slides: [
            //     {
            //         key: 0,
            //         src: "http://placekitten.com/g/400/100",
            //         name: "name1"
            //     },
            //     {
            //         key: 1,
            //         src: "http://placekitten.com/g/400/200",
            //         name: "name2"
            //     },
            //     {
            //         key: 2,
            //         src: "http://placekitten.com/g/400/300",
            //         name: "name2"
            //     },
            //     {
            //         key: 3,
            //         src: "http://placekitten.com/g/400/400",
            //         name: "name3"
            //     },
            //     {
            //         key: 4,
            //         src: "http://placekitten.com/g/400/500",
            //         name: "name4"
            //     },
            //     {
            //         key: 5,
            //         src: "http://placekitten.com/g/400/600",
            //         name: "name5"
            //     }
            // ]
        };
        this.searchHandler = this.searchHandler.bind(this);
        // this.appendFavouriteCity = this.appendFavouriteCity.bind(this)
        this.favouriteHandle = this.favouriteHandle.bind(this);
        this.fetchPhoto = this.fetchPhoto.bind(this)
    }

    setWeather(weatherData) {
        this.setState({weatherData})
    }

    setCityPhotos(cityPhotos) {
        this.setState({cityPhotos})
        // debugger
    }


    fetchWeather() {
        let queryParam = queryString.parse(this.props.location.search);
        let request = {};
        if (undefined !== queryParam.name) {
            request = new Request(`http://api.openweathermap.org/data/2.5/weather?q=${queryParam.name}&units=metric&APPID=${this.openWeatherAPIkey}`);
            if (request) {
                request.get(undefined,
                    (weatherDataJSON) => {

                        const weatherData = JSON.parse(weatherDataJSON);
                        if (weatherData.cod === 200) {
                            this.setWeather(weatherData);
                            this.updateCurrentCity('name', weatherData.name);
                            this.fetchPhoto(weatherData.name);
                        }
                    },
                    (e) => {
                        console.log(e);
                    },
                    {})
            }
        } else if (undefined !== queryParam.coordinates) {
            this.fetchWeatherByCoordinates();
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
                this.updateCurrentCity("smallImage", cityPhotos.results[0].urls.thumb);
                // debugger;
            },
            (e) => {
                console.log(e);
            },
            {})
    }

    componentDidMount() {
            {slides: }
        this.setState(
        console.log("-->>" + this.state.slides, localStorage.getItem('slides'));
        this.fetchWeather();
    }

    searchHandler(weatherData) {
        this.setWeather(weatherData)
    }


    favouriteHandle(favourValue) {
        this.setState({favourite: favourValue});
        const cityName = this.state.cityName;
        let favourites = [...this.state.favourites];
        if (favourValue) {

            favourites.push(this.state.cityName);
            this.setState({favourites});
            localStorage.setItem('series', this.state.slides)
        } else {
            // debugger;
            favourites = favourites.filter(function (e) {
                return e !== cityName
            });
            this.setState({favourites})
        }

        // console.log("favourites: " + this.state.favourites)
    };
    updateCurrentCity(key, value){
        this.setState(prevState => {
            let currentCity = Object.assign({}, prevState.currentCity);  // creating copy of state variable jasper
            currentCity[key] = value;                     // update the name property, assign a new value
            return { currentCity };                                 // return new object jasper object
        });
        console.log( this.state.currentCity)
    }
    render() {
        let weatherParam = {
            weatherData: this.state.weatherData,
            favourite: false,
            appendFavouriteCity: this.favouriteHandle
        };
        return (
            <div className="App">
                <div className='main'>

                    <Background images={this.state.cityPhotos}/>
                    <Weather {...weatherParam}/>
                    <FavouritesSlider {...this.state.slides}/>

                </div>
            </div>
        );
    }
}

//
// export default function DisplayButton(props) {
//     // It takes in props, props are anything you want to pass down in this case the click event handler that we named handleClick
//     return(
//         <button type="button" onClick={props.handleClick.bind(this)} className="toggleDislpayButton"> Display </button>
//     );
// };