import React, { Component } from 'react'

import '../css/components/hamburger.css';

export default class Hamburger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
        this.toggleHamburger = this.toggleHamburger.bind(this);
    }

    toggleHamburger(e) {
        this.setState({
            active: !this.state.active
        })
    }

    render() {
        return (
            <div className="hamburger">
                <div className="hamburger__logo" onClick={this.toggleHamburger}>
                    <i className="material-icons">menu</i>
                </div>

                <div className={"hamburger__content " + (this.state.active ? "hamburger__content--active" : "")}>
                    {this.props.contentComponent}
                </div>
            </div>
        )
    }
}
