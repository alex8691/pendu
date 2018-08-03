import React from 'react'
import PropTypes from 'prop-types'

import './Letter.css'

const HIDDEN_LETTER = '_'

const Letter = ({ letter, feedback }) => (
    <div className={`letter ${feedback}`}>
        <span className="symbol">
            {feedback === 'hidden' ? HIDDEN_LETTER : letter }
        </span>
    </div>
)

Letter.propTypes = {
    letter: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
        'hidden',
        'visible',
        'separator',
    ]).isRequired,
}

export default Letter