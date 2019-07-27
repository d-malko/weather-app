import React from 'react';

import queryString from 'query-string';
import _ from "lodash";

import {Background} from "../Background";
import {Weather} from "../Weather";
//
// import {Request} from "../../request";
// import {FavouritesSlider} from "../FavouritesSlider";
import 'weather-icons/css/weather-icons.css'
import './Home.scss'

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
        };
        this.updateCurrentCity = this.updateCurrentCity.bind(this);
        // this.setWeather = this.setWeather.bind(this);
        this.appendFavouriteCityHandle = this.appendFavouriteCityHandle.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.setFavouriteState = this.setFavouriteState.bind(this);
        // this.deleteSlide = this.deleteSlide.bind(this);
    }



    searchHandler(weatherData) {
        this.setWeather(weatherData)
    }

    setFavouriteState() {
        //callback for favourite baton on Weather component  // TODO if needed append this functionality to appendFavouriteCityHandle
        console.log("HOME: setfaourite", this.state.isFavourite)
        console.log("HOME: setfaourite", this.state)
        if (_.find(this.state.favourites, {name: this.state.currentCity.name})) {
            this.setState({isFavourite: true});
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
        this.setState(prevState => {
            let currentCity = Object.assign({}, prevState.currentCity);
            currentCity[key] = value;
            return {currentCity};
        });
        // console.log(this.state.currentCity)
    }

    // deleteSlide(cityName) {
    //     let favourites = this.state.favourites;
    //     _.remove(favourites, function (e) {
    //         return e.name === cityName;
    //     });
    //     this.setState(
    //         {favourites: [...favourites]},
    //         () => {
    //             localStorage.setItem('favourites', JSON.stringify(favourites))
    //         }
    //     )
    // }

    componentDidMount() {
        let cityName = queryString.parse(this.props.location.search).name;
        console.log('HOME: DidMount!!!!!!!!!!!!', cityName)
        if (!cityName) {
            cityName = 'coordinates'
        }
        this.updateCurrentCity('name', cityName);
        // this.setFavouriteState()
    }

    componentWillReceiveProps(nextProps, nextContext) {

        let cityName = queryString.parse(this.props.history.location.search).name;
        console.log('HOME: Receive props!!!!!!!!!!!', cityName);
        if (!cityName) {
            cityName = 'coordinates'
        }
        this.updateCurrentCity('name', cityName);
        this.setFavouriteState()
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
            setFavouriteState: this.setFavouriteState
        };
        let forecastParam = Object.assign({'type': 'forecast'}, weatherParam);
        weatherParam['type'] = 'weather';
        // let forecastParam = {
        //     weatherData: this.state.weatherData,
        //     isFavourite: this.state.isFavourite,
        //     appendFavouriteCity: this.favouriteHandle
        // };
        console.log("HOME: render.param-->>", weatherParam);
        console.log("HOME: render.state-->>", this.state);
        // let slidesParam = {
        //     deleteSlide: this.deleteSlide,
        //     favourites: this.state.favourites
        // };
        // console.log("HOME.slides.param-->>", slidesParam);
        return (

            <div className="App">
                <div className='main'>
                    <Background {...backgroundParam}/>
                    <Weather {...weatherParam}/>
                    {/*<Weather5days {...forecastParam}/>*/}
                    {/*<FavouritesSlider {...slidesParam}/>*/}

                </div>
            </div>
        );

    }
}