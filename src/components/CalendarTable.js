import React, { Component } from 'react';

import '../css/components/calendar-table.css';


import BreakDragHelper from '../js/breakDragHelper'

class CalendarTable extends Component {
    constructor(props) {
        super(props)
        //Manages when to add breaks while dragging
        this.state = {
            breaks: [0,0,0,0,0],
            rescheduleTimeout: null,
            addBreak: false,
            mousedown: false,
            mouseupInit: false,
            allBreaks: props.allBreaks            
        }
        this.toggleBreak = this.toggleBreak.bind(this)
        this.fireUpdateBreaks = this.fireUpdateBreaks.bind(this)
    }

    fireUpdateBreaks() {
        this.props.updateBreaks(this.state.breaks, this.props.term)
    }

    toggleBreak(e) {
        // set this.state.breaks[dataDay] at the correct bit to this.state.addBreak
        function updateBreaks (dataDay, dataTime) {
            let mask = 1 << dataTime
            let newBreaks = [...this.state.breaks]
            if (this.state.addBreak) newBreaks[dataDay] |= mask
            else newBreaks[dataDay] &= ~mask
            // setState to rerender
            this.setState({ breaks: newBreaks }) 
        }

        if (!this.state.mouseupInit) {
            // If mouseup after mousedown, schedule action to update breaks in the future
            const onmouseupHandler = (e) => {
                if (this.state.mousedown === true) this.setState({ rescheduleTimeout : setTimeout(this.fireUpdateBreaks, 1000)});
                this.setState({ mousedown : false })
                BreakDragHelper.resetBlockSections()                  
            }
            document.addEventListener('mouseup', onmouseupHandler.bind(this))
            this.setState({ mouseupInit : true })
        }

        const dataDay = parseInt(e.target.attributes["data-day"].value, 10)
        const dataTime = parseInt(e.target.attributes["data-time"].value, 10)    
        switch (e.type) {
            case 'mousedown':
                // Only trigger when left click
                if (e.button === 0) {
                    clearTimeout(this.state.rescheduleTimeout);                            
                    const breakWhereClicked = ((this.state.breaks[dataDay] >> dataTime) & 1)

                    this.setState({
                        addBreak: !breakWhereClicked,
                        mousedown: true
                    })
                    BreakDragHelper.setMousedown(true)
                    updateBreaks.call(this, dataDay, dataTime) 
                }
                break;
            case 'mouseover':
                if (this.state.mousedown) updateBreaks.call(this, dataDay, dataTime)
                break;
            default:
                break;
        }
    }

    render() {
        const hours =   [' 8:00', ' 8:30', ' 9:00', ' 9:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                         '12:30',' 1:00', ' 1:30', ' 2:00', ' 2:30', ' 3:00', ' 3:30', ' 4:00', ' 4:30', 
                         ' 5:00', ' 5:30', ' 6:00', ' 6:30', ' 7:00', ' 7:30', ' 8:00', ' 8:30',  ' 9:00', '9:30']
        return (
            <div className="calendar__table-container">
                <table className="calendar__table">
                    <tbody>
                        <tr className="calendar__row calendar__row--days">
                            <td className="calendar__block calendar__block--time"></td>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                                <td className="calendar__block calendar__block--day" key={"block--day_" + this.props.term + day}>{day}</td>
                            ))}
                        </tr>
                        {hours.map((hour, hourIdx) => {
                            let calendarBlockTime;
                            if (hour.substr(-2) === '00') calendarBlockTime = <td className="calendar__block calendar__block--time" rowSpan="2">{hour}</td>
                            return (
                                <tr className="calendar_row" key={"calendar__row_" + this.props.term + hourIdx}>
                                    {calendarBlockTime}
                                    {[0, 1, 2, 3, 4].map(dayIdx => (
                                        <td key={"block_" + this.props.term + dayIdx + hourIdx}
                                            className={"calendar__block " + (( ((this.state.breaks[dayIdx]) >> hourIdx) & 1) ? "calendar__block--break" : "")} 
                                            data-day={dayIdx} 
                                            data-time={hourIdx}
                                            onMouseDown={this.toggleBreak}
                                            onMouseOver={this.toggleBreak} ></td>
                                    ))}
                                </tr>
                            )
                        })}                        
                    </tbody>
                </table>
            </div>
        )
    }
}
CalendarTable.getDerivedStateFromProps = (nextProps, prevState)=>  {
    if (nextProps.allBreaks === prevState.allBreaks) {
        return prevState
    }
    return {
        ...prevState,
        allBreaks: nextProps.allBreaks,
        breaks: nextProps.breaks
    }
}

export default CalendarTable