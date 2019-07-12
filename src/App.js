import React from 'react';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import './App.css';
import './styles/base.scss'

import {Navbar} from "./components/Navbar";
import {Home} from "./components/Home";
import {Search} from "./components/Search";

export default class App extends React.Component {
    constructor(props) {
        super(props);

    }

    searchHandler(value) {
        // console.log(value)
    }

    render() {
        return (<div className="App">
                <Router>
                    <Navbar onSearch={this.searchHandler}/>
                    <Switch>
                        <Route exact={true} path="/" component={Home}/>
                        <Route path="/search/:queryString" component={Search}/>
                        <Route path="/about" component={() => {
                            return <h2>About page</h2>
                        }}
                        />
                        <Route path="/404" component={() => <h2>Not found!</h2>}/>
                        <Redirect to="/404"/>
                    </Switch>
                </Router>
            </div>
        );
    }
}
