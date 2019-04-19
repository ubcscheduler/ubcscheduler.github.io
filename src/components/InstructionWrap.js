import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleInsructionWrap } from '../actions/panelActions'
import '../css/components/instruction-wrap.css';

class InstructionWrap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      instructionId: this.props.instructionId
    }

    this.expand = this.expand.bind(this)
  }

  expand(e) {
    this.props.toggleInsructionWrap(this.state.instructionId)
  }

  render() {
    return (
      <div className="instruction-wrap">
        <div className="instruction__header">
            <div className="instruction__type">{this.props.instructionType}</div>
            <div className="instruction__msg">{this.props.instruction}</div>
        </div>
        <div className={"instruction-wrap__content " + (this.state.expanded ? "" : "display-none")}>
          {this.props.contentComponent}
        </div>        
        <div className="instruction__footer" onClick={this.expand}>
            {this.state.expanded ? "Collapse" : "Expand"}
        </div>
      </div>
    )
  }
}

InstructionWrap.getDerivedStateFromProps = (nextProps, prevState) => {
  return {
    ...prevState,
    expanded: nextProps.expandedInstructions[prevState.instructionId]
  }
}

const mapStateToProps = state => ({
  expandedInstructions: state.sidepanel.expandedInstructions
});

export default connect(mapStateToProps, { toggleInsructionWrap })(InstructionWrap)