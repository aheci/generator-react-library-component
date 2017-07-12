import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

const propTypes = {
  
}

const defaultProps = {
  
}

export default function <%= componentNamePretty %>(props) {
  return (
    <div className="<%= componentNamePiped %>">
      {/* Place your elements here */}
    </div>
  )
}

<%= componentNamePretty %>.propTypes = propTypes;
<%= componentNamePretty %>.defaultProps = defaultProps;