import React from 'react';
import './Home.scss'

import { Background } from "../Background";
import { Weather} from "../Weather";
// import WeatherIcons from 'react-weathericons';
// import { WiDaySunny } from 'weather-icons-react';
import 'weather-icons/css/weather-icons.css'
import {Request} from "../../request";

export class Home extends React.Component {
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
        const request = new Request('http://api.openweathermap.org/data/2.5/find?lat=49.553917299999995&lon=25.639974100000003&lang=ru&units=metric&APPID=dcadc5c4c9a9cbaa47c897672f8a7ed1&mode=json&cnt=1');

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
        const request = new Request('https://api.unsplash.com/search/photos?page=1&query=Kiev&per_page=5&client_id=942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d');
        // const request = new Request('https://api.unsplash.com/search/photos?page=1&query=${this.props.match.params.queryString}&client_id=942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d');

        request.get(undefined,
            (cityPhotosJSON) => {
                const cityPhotos = JSON.parse(cityPhotosJSON);
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
                </div>
            </div>
        );
    }
}