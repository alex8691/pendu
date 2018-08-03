import React from 'react'

import './Drawings.css'

const Drawings = ({hidden}) => (
    <div className={`drawings ${hidden && "hidden"}`}>
        <canvas className='canvas' id="myCanvas"></canvas>
    </div>
)


export default Drawings