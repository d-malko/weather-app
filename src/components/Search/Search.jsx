import React from 'react';
import './Search.scss'

import { Background } from "../Background";
import { Weather} from "../Weather";
import { FavouritesSlider } from "../FavouritesSlider";
// import WeatherIcons from 'react-weathericons';
// import { WiDaySunny } from 'weather-icons-react';
import 'weather-icons/css/weather-icons.css'
import {Request} from "../../request";

export class Search extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            weatherData: {},
            cityPhotos: {},
            currentPage: 1
        };
        // this.nextImages = this.nextImages.bind(this);
        this.searchHandler = this.searchHandler.bind(this)
    }

    setWeather(weatherData) {
        this.setState({weatherData})
    }
    setCityPhotos(cityPhotos) {
        this.setState({cityPhotos})
    }

    fetchWeather() {
        if (this.props.match.params.queryString && this.props.match.params.queryString.hasOwnProperty('name')){
            console.log(this.props.match.params.queryString)
        } else if(this.props.match.params.queryString.hasOwnProperty('coordinates')){
            console.log(this.props.match.params.queryString)
        }
        const request = new Request(`http://api.openweathermap.org/data/2.5/weather?q=${this.props.match.params.queryString}&APPID=dcadc5c4c9a9cbaa47c897672f8a7ed1`);

        request.get(undefined,
            (weatherDataJSON) => {
                const weatherData = JSON.parse(weatherDataJSON)["list"][0];
                this.setWeather(weatherData)
            },
            (e) => {
                console.log(e);
            },
            {})
    }

    fetchPhoto() {
        const request = new Request(`https://api.unsplash.com/search/photos?page=1&query=${this.props.match.params.queryString}&per_page=5&client_id=942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d`);
        // const request = new Request('https://api.unsplash.com/search/photos?page=1&query=${this.props.match.params.queryString}&client_id=942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d');

        request.get(undefined,
            (cityPhotosJSON) => {
                console.log(cityPhotosJSON);
                const cityPhotos = JSON.parse(cityPhotosJSON) || {};
                this.setCityPhotos(cityPhotos)
            },
            (e) => {
                console.log(e);
            },
            {})
    }

    componentDidMount() {
        this.fetchWeather();
        this.fetchPhoto()
    }

    searchHandler(weatherData) {
        this.setWeather(weatherData)
    }

    render() {
        return (
            <div className="App">
                <div className='main'>
                    <Background images={this.state.cityPhotos}/>
                    <Weather weatherData={this.state.weatherData}/>
                    <FavouritesSlider/>
                </div>
            </div>
        );
    }
}