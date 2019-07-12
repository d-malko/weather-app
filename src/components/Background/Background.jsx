import React from 'react';
import './Background.scss';
import './demo.scss'

class Hello extends React.Component {
    render (){
        let images = this.props.images;
        if ( images ) {


        // img1 = images[0].urls.full;
         console.log(images[0].urls.full)

        let backgroundImages = this.props.images.map((image) => {
            return (
                <li ><span style={{ backgroundImage: 'url('+image.urls.full+')'}}>Image 01</span>
                    {/*<li style={{backgroundImage: 'url('+img1+')'}}><span>Image 01</span>*/}
                    <div><p></p></div>
                </li>
            )
        });
        return  <ul className="cb-slideshow">{ backgroundImages }</ul>
        }
        return true
        // let names = ['Jake', 'Jon', 'Thruster'];
        // let namesList = names.map((name, index) => {
        //     return <li key={ index }>{name}</li>;
        // });
        //
        // return  <ul>{ namesList }</ul>
    }
}

export class Background extends React.Component {
    render() {
        // const images = require(`./images/6.jpg`);
        const images = this.props.images.results;
        // let  img1 = "";
        // console.log(images);
        // if ( images ) {


           // img1 = images[0].urls.full;
           //  console.log(images[0].urls.full)
        // }
        return (
            <div className="background">
                {/*{console.log(img1)}*/}
                {/*<ul className="cb-slideshow">*/}
                    <Hello images={this.props.images.results}/>
                    {/*{ backgroundUrls }*/}
                {/*    <li ><span style={{ backgroundImage: 'url('+img1+')'}}>Image 01</span>*/}
                {/*        <li style={{backgroundImage: 'url('+img1+')'}}><span>Image 01</span>*/}
                        {/*<div><p></p></div>*/}
                    {/*</li>*/}
                    {/*<li><span>Image2</span>*/}
                    {/*    <div><p></p></div>*/}
                    {/*</li>*/}
                    {/*<li><span>Image 03</span>*/}
                    {/*    <div><p></p></div>*/}
                    {/*</li>*/}
                    {/*<li><span>Image 04</span>*/}
                    {/*    <div><p></p></div>*/}
                    {/*</li>*/}
                    {/*<li><span>Image 05</span>*/}
                    {/*    <div><p></p></div>*/}
                    {/*</li>*/}
                {/*</ul>*/}
            </div>
        );
    }
}
