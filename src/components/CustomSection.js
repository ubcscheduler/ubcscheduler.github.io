import React, { Component } from 'react'

import '../css/components/section.css';


export default class CustomSection extends Component {
    constructor(props) {
        super(props)

        this.addTemp = this.addTemp.bind(this)
        this.removeTemp = this.removeTemp.bind(this)
    }

    addTemp(e) {
        if (!this.props.section.active) this.props.addTemp(this.props.section)
    }
    removeTemp(e) {
        this.props.removeTemp()
    }

    render() {
        return (
            <div
                className="remove-btn-parent course__button course__section"
                onMouseOver={this.addTemp}
                onMouseOut={this.removeTemp}
            >
                <div className="remove-btn" onClick={this.props.removeSection}>
                    <i className="material-icons">&#xE5CD;</i>
                </div>
                {this.props.section.section}
            </div>
        )
    }
}


