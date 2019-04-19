import React, { Component } from 'react'

import '../css/components/links.css';

export default class Links extends Component {
    render() {
        return (
            <div className="links__container">
                <span>Bugs & Features:</span> 
                <div className="github__linkWrap">
                    <a className="github__link" href="https://github.com/ubcscheduler/ubcscheduler.github.io/issues" target="_blank"></a>
                </div>
            </div>
        )
    }
}
