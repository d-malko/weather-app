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


    fetchPhoto(cityName) {
        // console.log('fetchPhoto: ', cityName);
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
        // console.log('Background:', nextProps.cityName);
        if (nextProps.cityName !== this.props.cityName && nextProps.cityName !== 'coordinates') {
            this.setState({'cityName': nextProps.cityName}, this.fetchPhoto(nextProps.cityName) )

        }
    }

    renderList() {
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
        return (
            <div className="background">
                {this.renderList(this.props.cityName)}
            </div>
        );
    }
}
