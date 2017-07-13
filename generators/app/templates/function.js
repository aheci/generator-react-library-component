import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

const propTypes = {
  
}

const defaultProps = {
  
}

export default function <%= componentName %>(props) {
  return (
    <div className="<%= componentNamePiped %>">
      {/* Place your elements here */}
    </div>
  )
}

<%= componentName %>.propTypes = propTypes;
<%= componentName %>.defaultProps = defaultProps;