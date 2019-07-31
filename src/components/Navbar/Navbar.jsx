import React from 'react';
import './Navbar.scss';
import {Link} from "react-router-dom";
import {SearchForm} from "../SearchForm";
import ForecastHourly from '../../components/ForecastHourly';
import ForecastDaily from '../../components/ForecastDaily';
import Navigation from '../../components/Navigation';

export class Navbar extends React.Component {
    render() {
        return <nav className="nav">
            <div className="nav__content">
                <div className="nav__search-form">
                    <SearchForm onSearch={this.props.onSearch}/>
                </div>

                <ul>
                    <li>
                        <Link to={"/"}><img alt='Home' src={require('../../images/gps.png')} style={{height: '40px'}}/></Link>
                    </li>
                    {/*<li>*/}
                    {/*    <Link to={"/about"}>About</Link>*/}
                    {/*</li>*/}
                </ul>
            </div>
        </nav>
    }
}