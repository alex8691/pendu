import React from 'react'
import PropTypes from 'prop-types'

import './Key.css'

const Key = ({letter, feedback, onClick}) => (
    <div className={`key ${feedback}`} onClick={() => onClick(letter)}>
        <span className="symbol">
            {letter}
        </span>
    </div>
)

Key.propTypes = {
    letter: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
        'never_pressed',
        'pressed'
    ]).isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Key