import React, { Component } from 'react';

import '../css/components/calendar-blocks.css';

import BlockSection from './BlockSection';


export default class CalendarBlocks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            schedule: this.props.schedule
        }
    }
    
    isTempSectionTerm() {
        const sectionTerm = this.props.tempSection.term
        if (sectionTerm === '1') {
            return this.props.term === 't1'
        } else if (sectionTerm === '2') {
            return this.props.term === 't2'
        } else if (sectionTerm === '1-2') {
            return true
        } else {
            console.log("Incorrect term in section")
            return false
        }
    }

    render() {
        return (
            <div className="calendar__blocks">
                {   
                                      
                    [0,1,2,3,4].map(day => {
                        let tempSection;
                        if (this.props.tempSection.schedule && this.props.tempSection.schedule[day] && this.isTempSectionTerm()) {
                            tempSection =   (<BlockSection
                                                name={this.props.tempSection.course + " " + this.props.tempSection.section}
                                                schedule={this.props.tempSection.schedule[day]}
                                                temp={true}
                                                term={this.props.term}
                                            />)
                        }
                        return (
                            <div className="block__daycol" key={"block__daycol" + day}>
                                {
                                    this.state.schedule.map(section => {
                                        if (section.schedule[day] === 0) return null
                                        return  (
                                            <BlockSection 
                                                key={section.course + section.section + day} 
                                                name={section.course + " " + section.section}
                                                schedule={section.schedule[day]}
                                                toggleLock={this.props.toggleLock}
                                                lockedSections={this.props.lockedSections}
                                                term={this.props.term}
                                            />
                                        )
                                    })
                                }
                                {tempSection}
                            </div>
                        )
                })}
            </div>
        )
    }
}

CalendarBlocks.getDerivedStateFromProps = (nextProps, prevState)=>  {
    return {
        ...prevState,
        schedule: nextProps.schedule
    }
}