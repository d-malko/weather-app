import React from 'react';
import './Background.scss';
import './demo.scss'


export class Background extends React.Component {
    renderList(images){
        // let images = this.props.images;
        if (images) {
            let backgroundImages = images.map((image) => {
                return (
                    <li><span style={{backgroundImage: 'url(' + image.urls.full + ')'}}>Image 01</span>
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
                {this.renderList(this.props.images.results)}
            </div>
        );
    }
}
