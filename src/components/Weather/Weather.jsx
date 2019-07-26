import React from 'react';
import './Weather.scss';
// import 'weather-icons/css/weather-icons.css'
import weatherIcons from "./icons.js";

export class Weather extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherData: "",
            isFavourite: "",
            cityName: ""
        };
        this.renderCityWeather = this.renderCityWeather.bind(this);
    }

    renderCityWeather() {
        let weatherData = this.props.weatherData;
        let prefix = 'wi wi-';
        let weatherClass = "";
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

    handleFavouriteChange = () => {
        let favour = !this.state.isFavourite;
        this.props.appendFavouriteCity(favour);
        this.setState({isFavourite: favour});
    };
    favouriteBtn() {
        return {


        }
    }

    componentDidMount() {
        this.setState({weatherData: this.props.weatherData});
        this.setState({isFavourite: this.props.isFavourite})
    }


    render() {
        return (
            <div className="glass">
                <div className="weather">
                    {this.renderCityWeather()}
                    <button className='favouriteBtn'
                            style={this.props.isFavourite ? {backgroundColor: "yellow"} : {backgroundColor: "transparent"}}
                            onClick={this.handleFavouriteChange}>
                        favourites
                    </button>

                </div>
            </div>
        )

    }
}



//
// <!DOCTYPE html>
// <html>
// <head>
//     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
//         <style>
//             .fa {
//             font-size: 50px;
//             cursor: pointer;
//             user-select: none;
//             color:yellow;
//             background-color: yellow
//         }
//
//         </style>
// </head>
// <body>
//
// <p>Click on the icon to toggle between thumbs-up and thumbs-down (like/dislike):</p>
//
// <i onclick="myFunction(this)" class="fa fa-star fa-star-o"></i>
//
//
//
// <script>
//     function myFunction(x) {
//     x.classList.toggle("fa-star-o");
// }
// </script>
//
// </body>
// </html>
//

