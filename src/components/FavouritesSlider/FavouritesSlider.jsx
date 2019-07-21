import React, {Component} from "react";
import Slider from "react-slick";
import './FavouritesSlider.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export class FavouritesSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            slides: [
            ]

        };
    }


    onButtonClick = (key) => {
        const {slides, currentSlide} = this.state;
        for( let i = 0; i < slides.length; i++){
            if ( slides[i].key === key) {
                slides.splice(i, 1);
            }
        }

        // slides.splice(currentSlide, 1);
        this.setState({slides});
    };

    before = () => {
    };

    updateCurrentSlide = current => {
        this.setState({currentSlide: current});
    };

    updateSlides = current => {
        this.setState({currentSlide: current});
    };

    renderSlide(index) {
        return (

            <div className="slide" key={index}>
                <button onClick={() => this.onButtonClick(index.key)}>X</button>
                <div>
                    <span>
                        <img key={index.key} src={index.src}/>
                        {index.name}
                        </span>
                </div>

            </div>
        );
    }

    renderSlider() {
        const {slides} = this.state;
        let settings = {
            dots: true,
            slidesToShow: 5,
            beforeChange: this.before,
            afterChange: this.updateCurrentSlide,
            infinite: true,
            autoplay: true,
            speed: 400,
            autoplaySpeed: 2000,
            centerMode: true,
            // adaptiveHeight: true
        };

        return (

            <Slider {...settings}>
                {slides.map(s => this.renderSlide(s))}
            </Slider>
        );
    }


    render() {
        const {slides, currentSlide} = this.state;
        // console.log(slides, currentSlide);
        if (!slides.length) return null;

        return (
                <div className="container">
                    {slides.length > 0 ? this.renderSlider() : this.renderSlide(slides[0])}
                </div>


        );
    }
}

// ReactDOM.render(<ReactSlickDemo />, document.getElementById("container"));
