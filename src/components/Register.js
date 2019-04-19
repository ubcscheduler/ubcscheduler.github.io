import React, { Component } from 'react';
import { connect } from 'react-redux';


import '../css/components/register.css';


class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sectionNameObjs: { t1: [], t2: [] },
      t1Schedule: [],
      t2Schedule: []
    }

    this.sectionClicked = this.sectionClicked.bind(this)
    this.clearClicks = this.clearClicks.bind(this)
  }
  
  sectionClicked = (sectionNameObj, term) => (e) => {
    sectionNameObj.clicked = true
    this.setState({
      sectionNameObj: { ...this.state.sectionNameObjs }
    })
    e.stopPropagation()
  }

  clearClicks(e) {
    this.state.sectionNameObjs.t1.forEach(s => s.clicked = false)
    this.state.sectionNameObjs.t2.forEach(s => s.clicked = false)
    this.setState({
      sectionNameObj: { ...this.state.sectionNameObjs }
    })
    e.stopPropagation()
  }

  renderSectionLinksByTerm(term) {
    return this.state.sectionNameObjs[term].map(sectionNameObj => (
      <div className="register__section" key={"register__section" + sectionNameObj.dept + sectionNameObj.code + sectionNameObj.section}>
        <div className={"section__indicator " + (sectionNameObj.clicked === true ? "display-none" : "")}>
          <i className="material-icons">check_circle_outline</i>
        </div>
        <div className={"section__indicator section__indicator--clicked " + (sectionNameObj.clicked === true ? "" : "display-none")}>
          <i className="material-icons">check_circle</i>
        </div>
        <a className="section__link"
          href={`https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&sessyr=2018&sesscd=W&dept=${sectionNameObj.dept}&course=${sectionNameObj.code}&section=${sectionNameObj.section}`}
          target="_blank"
          onClick={this.sectionClicked(sectionNameObj, term)}>
          {`${sectionNameObj.dept} ${sectionNameObj.code} ${sectionNameObj.section}`}
        </a>
      </div>
    ))
  }

  render() {
    return (
      <div className="tool__container tool__container--register">
        <div className="btn btn-icon btn--blue time-widget__add-btn register__clear-btn" onClick={this.clearClicks}>
          <i className="material-icons">clear_all</i>
          <span>clear</span>
        </div>
        <div className="panel__header panel__header--register">::Term 1::</div>
        <div className="register__section-container">
          {this.renderSectionLinksByTerm("t1")}
        </div>
        <div className="panel__header panel__header--register">::Term 2::</div>
        <div className="register__section-container">
          {this.renderSectionLinksByTerm("t2")}
        </div>
      </div>
    )
  }
}

function mapScheduleToSectionNameObj(schedule) {
  return schedule.map(section => {
    let splitCourseName = section.course.split(" ")
    return {
      dept: splitCourseName[0],
      code: splitCourseName[1],
      section: section.section,
      clicked: false
    }
  })
}

Register.getDerivedStateFromProps = (nextProps, prevState) => {
  if (nextProps.t1Schedule === prevState.t1Schedule && nextProps.t2Schedule === prevState.t2Schedule) return prevState
  return {
    sectionNameObjs: {
      t1: mapScheduleToSectionNameObj(nextProps.t1Schedule),
      t2: mapScheduleToSectionNameObj(nextProps.t2Schedule)
    },
    t1Schedule: nextProps.t1Schedule,
    t2Schedule: nextProps.t2Schedule
  }
}


const mapStateToProps = state => ({
  t1Schedule: state.scheduler.schedules.t1[state.scheduler.index.t1],
  t2Schedule: state.scheduler.schedules.t2[state.scheduler.index.t2]
});

export default connect(mapStateToProps, {})(Register)