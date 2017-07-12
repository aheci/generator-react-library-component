import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.scss'

const propTypes = {
  //register props
}

const defaultProps = {
  //set default props
}

export default class TestTwo extends Component {
  constructor() {
    super();
    this.state = {
      //initial statemanagement here
    };
    //bind this for any custom functions here
  }
  componentDidMount() {
    //Setting state in this method will trigger a re-rendering.
  }
  
  componentWillReceiveProps(nextProps) {
    //Not called on initial render
  }
  
  componentWillUpdate(nextProps, nextState) {
    //Note that you cannot call this.setState() here. If you need to update state in response to a prop change, use componentWillReceiveProps() instead.
  }
  
  componentDidUpdate(prevProps, prevState) {
    //componentDidUpdate() is invoked immediately after updating occurs. This method is not called for the initial render.
  }
  
  componentWillUnmount() {
    //componentWillUnmount() is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any DOM elements that were created in componentDidMount
  }
  
  render() {
    return (
      <div className="test-two">
        {/* Place your elements here */}
      </div>
    )  
  }
}

TestTwo.propTypes = propTypes;
TestTwo.defaultProps = defaultProps;