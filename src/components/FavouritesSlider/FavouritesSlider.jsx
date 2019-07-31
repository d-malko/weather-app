import * as  React from "react";
import {Redirect, Link} from "react-router-dom";
import Slider from "react-slick";
import './FavouritesSlider.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export class FavouritesSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            slides: []
        };
        this.renderSlider = this.renderSlider.bind(this)
    }

    onButtonClick = (index) => {
        const {slides, currentSlide} = this.state;
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].key === index.key) {
                slides.splice(i, 1);
            }
        }

        this.props.deleteSlide(index.name)
    };

    before = () => {
    };

    updateCurrentSlide = current => {
        this.setState({currentSlide: current});
    };

    updateSlides = current => {
        this.setState({currentSlide: current});
    };

    routeChange() {
        let path = `newPath`;
        this.props.history.push(path);
    }

    renderSlide(index) {
        if (index) {
            return (
                <div className="slide" key={index}>
                    <button onClick={() => this.onButtonClick(index)}>X</button>
                    <div>
                    <span>
                        <Link to={`/?name=${index.name}`}>
                            <img alt="" src={index.smallImage}/>
                        </Link>
                        {/*<img alt="" src={index.src} onClick={() => <Redirect to={`/?name=${index.name}`}/>}/>*/}
                        {/*<img alt="" src={index.src} onClick={() => console.log(`/?name=${index.name}`)}/>*/}
                        {index.name}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (<div className="slide" key={index}></div>)
        }
    }

    renderSlider() {

        const slides = this.props.slides;
        let settings = {
            dots: true,
            slidesToShow: 4,
            beforeChange: this.before,
            afterChange: this.updateCurrentSlide,
            infinite: true,
            autoplay: true,
            speed: 400,
            autoplaySpeed: 2000,
            centerMode: true,
            // adaptiveHeight: true
        };
        // console.log('Slider: ', this.state.slides);
        if (slides !== 'undefined' && slides.length > 0) {
            return (
                <Slider {...settings}>
                    {slides.map(s => this.renderSlide(s))}
                </Slider>
            );
        }

    }

    componentWillReceiveProps() {
        this.setState({slides: this.props.slides});
    }

    render() {
        console.log("SLIDER render state:", this.state)
        console.log("SLIDER render props:", this.props)
        // if (this.props.)
        const slides = this.props.slides;
        return (
            <div className="container">
                {slides.length > 0 ? this.renderSlider() : this.renderSlide(slides[0])}
            </div>
        );
    }
}
