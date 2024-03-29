import React from 'react';

import queryString from 'query-string';
import _ from "lodash";

import {Background} from "../Background";
import {Weather} from "../Weather";
//
// import {Request} from "../../request";
import {FavouritesSlider} from "../FavouritesSlider";
import {Forecast} from "../Forecast";

// import {ForecastHourly} from '../../components/ForecastHourly';
// import {ForecastDaily } from '../../components/ForecastDaily';
// import {Navigation} from '../../components/Navigation';
import 'weather-icons/css/weather-icons.css'
import './Home.scss'
import { Spinner} from "../Spinner";

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // weatherData: {},
            // forecastData: {},
            // queryParam: "",
            // cityPhotos: {},
            // currentPage: 1,
            // cityName: "",
            // isLoading: true,
            // latitude: null,
            // longitude: null,
            error: null,
            isFavourite: false,
            currentCity: {
                name: "",
                smallImage: "",
                bigImage: ""
            },
            favourites: [],
            uploadFavourite: false,
        };
        this.updateCurrentCity = this.updateCurrentCity.bind(this);
        // this.setWeather = this.setWeather.bind(this);
        this.appendFavouriteCityHandle = this.appendFavouriteCityHandle.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.checkFavouriteState = this.checkFavouriteState.bind(this);
        this.deleteSlide = this.deleteSlide.bind(this);
        this.getFavouritesLocalStorage = this.getFavouritesLocalStorage.bind(this)
        // this.freeze = this.freeze.bind(this)
    }

    capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    freeze() {
        setTimeout(this.checkFavouriteState, 2500)
    }


    getFavouritesLocalStorage() {
        let favourites = JSON.parse(localStorage.getItem('favourites'));
        if (favourites === null || favourites === undefined) {
            favourites = []
        }
        console.log("HOME: BEFORE set favourites", this.state.favourites, favourites);

        this.setState({favourites},
            this.freeze,
        )

    }

    searchHandler(weatherData) {
        this.setWeather(weatherData)
    }

    checkFavouriteState() {
        //callback for favourite baton on Weather component  // TODO if needed append this functionality to appendFavouriteCityHandle
        console.log("HOME: AFTER set state: ", this.state.favourites)
        console.log("HOME: setfaourite", this.state.isFavourite)
        console.log("HOME: setfaourite", this.state)
        console.log("HOME: setfaourite", this.state.currentCity.name)


        const favourites = this.state.favourites;
        if (favourites !== null && favourites.length > 0) {
            if (favourites.find(o => o.name === this.state.currentCity.name)) {
                this.setState(
                    (state) => {
                        return {...state, ...{isFavourite: true, uploadFavourite: true}}
                    }
                );
            } else {
                this.setState({isFavourite: false, uploadFavourite: true})
            }
        } else {
            this.setState({uploadFavourite: true})
        }


    }

    appendFavouriteCityHandle(favourValue) {
        this.setState({isFavourite: favourValue});
        const cityName = this.state.currentCity.name;
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
            this.setState(
                {favourites: [...favourites]},
                () => {
                    localStorage.setItem('favourites', JSON.stringify(favourites))
                }
            );
        }
    };

    updateCurrentCity(key, value) {
        console.log('HOME: Update city', key, value);
        if (key === 'name') {
            value = this.capitalize(value);
        }
        this.setState(prevState => {
                let currentCity = Object.assign({}, prevState.currentCity);
                currentCity[key] = value;
                return {...prevState, currentCity: currentCity}
            },
            this.getFavouritesLocalStorage
        );
    }

    deleteSlide(cityName) {
        // debugger
        let favourites = this.state.favourites;
        favourites = favourites.filter(obj => obj.name !== cityName);
        // _.remove(favourites, function (e) {
        //     return e.name === cityName;
        // });
        this.setState(
            {favourites: [...favourites]},
            () => {
                localStorage.setItem('favourites', JSON.stringify(favourites))
            }
        )
    }


    componentDidMount() {

        let cityName = queryString.parse(this.props.location.search).name;
        console.log('HOME: DidMount!!!!!!!!!!!!', cityName);
        if (!cityName) {
            cityName = 'Coordinates'
        }
        this.updateCurrentCity('name', cityName);
    }

    componentWillReceiveProps(nextProps, nextContext) {

        let cityName = queryString.parse(this.props.history.location.search).name;
        console.log('HOME: Receive props!!!!!!!!!!!', cityName);
        if (!cityName) {
            cityName = 'Coordinates'
        }
        this.updateCurrentCity('name', cityName);
        // this.setFavouriteState()
    }


    render() {
        console.log('HOME: render: ', this.state);
        let backgroundParam = {
            cityName: this.state.currentCity.name,
            updateCurrentCity: this.updateCurrentCity
        };

        let weatherParam = {
            currentCity: this.state.currentCity,
            weatherData: this.state.weatherData,
            forecastData: this.state.forecastData,
            isFavourite: this.state.isFavourite,
            updateCurrentCity: this.updateCurrentCity,
            appendFavouriteCity: this.appendFavouriteCityHandle,
            setFavouriteState: this.checkFavouriteState
        };

        let forecastParam = Object.assign({'type': 'forecast'}, weatherParam);
        weatherParam['type'] = 'weather';
        // let forecastParam = {
        //     weatherData: this.state.weatherData,
        //     isFavourite: this.state.isFavourite,
        //     appendFavouriteCity: this.favouriteHandle
        // };
        console.log("HOME: render.weatherParam-->>", weatherParam);
        console.log("HOME: render.state-->>", this.state);
        let slidesParam = {
            deleteSlide: this.deleteSlide,
            slides: this.state.favourites
        };

        return (

            <div className='main'>
                <Background {...backgroundParam}/>
                {this.state.uploadFavourite === true
                    ? <div className="glass"> <Weather {...weatherParam}/>
                        <section className="forecasts">
                            <div className="forecasts__scroll-panel swiper-container">
                                <div className="swiper-wrapper">
                                    <Forecast cityName={ this.state.cityName }/>
                                </div>
                            </div>
                            {/*<Navigation currentForecast={this.state.currentForecast}/>*/}
                        </section>
                </div>

                        : <Spinner/>}
                {this.state.uploadFavourite === true ? <FavouritesSlider {...slidesParam}/>: <div/>}


            </div>
        );
    }
}