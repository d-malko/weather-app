import React from 'react';
import './Background.scss';
import './demo.scss'
import {Request} from "../../request";


export class Background extends React.Component {
    constructor(props) {
        super(props);
        this.unsplashAPIkey = '942ab6e6acc19e22fb5d3f9c954873294d6709ddadc8d44761ca32a95245390d';
        this.state = {
            cityName: "",
            cityPhotos: []
        };
        this.fetchPhoto = this.fetchPhoto.bind(this)
    }

    setCityPhotos(cityPhotos) {
        this.setState({cityPhotos})
    }


    fetchPhoto() {
        // console.log('fetchPhoto: ', cityName);
        let cityName = this.state.cityName;
        const request = new Request(`https://api.unsplash.com/search/photos?page=1&query=${cityName}&per_page=5&client_id=${this.unsplashAPIkey}`);
        // console.log('Request', request);
        request.get(undefined,
            (cityPhotosJSON) => {
                const cityPhotos = JSON.parse(cityPhotosJSON) || {};
                this.setCityPhotos(cityPhotos.results);
                this.props.updateCurrentCity("smallImage", cityPhotos.results[0].urls.thumb);
            },
            (e) => {
                console.log(e);
            },
            {})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('Background: receive props', nextProps.cityName);
        console.log('Background: receive props', this.state.cityName);
        if (nextProps.cityName !== this.state.cityName && nextProps.cityName !== 'coordinates') {
                // debugger
            this.setState( state => {
                return {...state, 'cityName': nextProps.cityName}
                }
                , this.fetchPhoto)
            this.setState({'cityName': nextProps.cityName}, this.fetchPhoto)

        }
    }

    renderList() {
        console.log("BACKGRND: render", this.props)
        console.log("BACKGRND: render", this.state)
        let images = this.state.cityPhotos;
        // console.log('renderlist images: ', images);
        if (images.length > 0) {
            // console.log("Images", images);
            let backgroundImages = images.map((image) => {
                return (
                    <li key={image.id} ><span style={{backgroundImage: 'url(' + image.urls.full + ')'}}>Image 01</span>
                        <div><p></p></div>
                    </li>
                )
            });
            return <ul className="cb-slideshow">{backgroundImages}</ul>
        }
        return true
    }

    render() {
        console.log("BACKGRND: render", this.props)
        console.log("BACKGRND: render", this.state)
        return (
            <div className="background">
                {this.renderList(this.props.cityName)}
            </div>
        );
    }
}
