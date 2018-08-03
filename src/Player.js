import React from 'react'
import PropTypes from 'prop-types'

import './Player.css'

const Player = ({ name, found, missed, strike, hanged, won, tour }) => (
    <tr className="player">
        <td className={`player ${tour}`} >
           {name}
        </td>
        <td>{found}</td>
        <td>{missed}</td>
        <td>{strike}</td>
        <td>{hanged}</td>
        <td>{won}</td>
    </tr>
)

Player.propTypes = {
    name: PropTypes.string.isRequired,
    found: PropTypes.number.isRequired,
    missed: PropTypes.number.isRequired,
    strike: PropTypes.number.isRequired,
    hanged: PropTypes.number.isRequired,
    won: PropTypes.number.isRequired,
}

export default Player