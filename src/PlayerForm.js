import React from 'react'

import './PlayerForm.css'

const PlayerForm = ({ players, onChange, onClick}) => (
    <div className="form">
        <form>
            {players.map((player, index) => (
                <label className="form label" key={index}>
                    Nom du joueur {index + 1}
                    <input className="form"
                        key={index}
                        name={index}
                        type="string"
                        defaultValue={player.name}
                        onChange={onChange}
                    />
                </label>
            ))}
        </form>
        <button className="form button" onClick={onClick} >Démarrer la partie</button>
    </div>
)

export default PlayerForm