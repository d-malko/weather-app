import React, {useEffect} from "react";
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

    // localStorage.getItem('favourites')

    onButtonClick = (index) => {
        const {slides, currentSlide} = this.state;
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].key === index.key) {
                slides.splice(i, 1);
            }
        }

        // let cityName = this.setState({slides});
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

    renderSlide(index) {
        // debugger;
        if (index) {
            // console.log('Slide: ', index);
            return (
                <div className="slide" key={index}>


                    <button onClick={() => this.onButtonClick(index)}>X</button>
                    <div>
                    <span>
                        <img src={index.src} onClick={() => console.log('onCLICK:', index.name)} />
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

        const slides = this.state.slides;
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
            // debugger;
            return (
                <Slider {...settings}>
                    {slides.map(s => this.renderSlide(s))}
                </Slider>
            );
        }

    }


    componentWillReceiveProps() {
        this.setState({slides: this.props.favourites});
    }

    render() {
        const {currentSlide, slides} = this.state;
        return (
            <div className="container">
                {slides.length > 0 ? this.renderSlider() : this.renderSlide(slides[0])}
            </div>
        );
    }
}


// ReactDOM.render(<ReactSlickDemo />, document.getElementById("container"));
