import React, { Component } from 'react'


import '../css/components/saved-schedule.css';

export default class SavedSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            save: props.save
        }
        this.load = this.load.bind(this)
        this.removeSave = this.removeSave.bind(this)
    }
    removeSave(e) {
        this.props.removeSave(this.state.save)
        e.stopPropagation()
    }
    load(e) {
        this.props.loadSchedule(this.state.save)
    }

    render() {
        return (
            <div className={"saved-schedule remove-btn-parent " + (this.state.save.selected ? "saved-schedule--selected" : "")} onClick={this.load}>
                <div className="remove-btn remove-btn--red" onClick={this.removeSave}>
                    <i className="material-icons">&#xE5CD;</i>
                </div>  
                {this.state.save.id}
            </div>
        )
    }
}

SavedSchedule.getDerivedStateFromProps = (nextProps, prevState) => {
    return {
      save: nextProps.save
    }
  }