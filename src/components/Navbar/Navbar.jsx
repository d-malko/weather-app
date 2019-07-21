import React from 'react';
import './Navbar.scss';
import {Link} from "react-router-dom";
import {SearchForm} from "../SearchForm";

export class Navbar extends React.Component {
    render() {
        return <nav className="nav">
            <div className="nav__content">
                <div className="nav__search-form">
                    <SearchForm onSearch={this.props.onSearch}/>
                </div>

                <ul>
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"/about"}>About</Link>
                    </li>
                </ul>
            </div>
        </nav>
    }
}