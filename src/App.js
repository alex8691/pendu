import React, { Component } from 'react';
import './App.css';

import Drawings from './Drawings'
import GuessCount from './GuessCount'
import Key from './Key'
import Letter from './Letter'
import Player from './Player';
import PlayerForm from './PlayerForm';

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const SEPARATORS = " ',.:"
const KEYBOARD = []
const KEYBOARD_WIDTH = 13
const PHRASES = [
  "ANIMAL",
  "AU DIABLE L'AVARICE",
  "LANGOUSTE",
  "LE CHIEN",
  "TABLEAUX",
  "TIMBALE",
  "VOITURE",
]
const PLAYERS = [
  { name: "Joueur 1", found: 0, missed: 0, hanged: 0, won: 0, strike: 0 },
  { name: "Joueur 2", found: 0, missed: 0, hanged: 0, won: 0, strike: 0 }
]
const PENDU_SHAPES = [
  { shape: "line", data: [10, 120, 10, 130] },
  { shape: "line", data: [10, 130, 110, 130] },
  { shape: "line", data: [110, 130, 110, 120] },
  { shape: "line", data: [110, 120, 10, 120] },
  { shape: "line", data: [60, 120, 60, 20] },
  { shape: "line", data: [60, 20, 160, 20] },
  { shape: "line", data: [60, 60, 110, 20] },
  { shape: "line", data: [160, 20, 160, 40] },
  { shape: "circle", data: [160, 50, 10, 0, 2] },
  { shape: "line", data: [160, 60, 160, 80] },
  { shape: "line", data: [160, 70, 150, 65] },
  { shape: "line", data: [160, 70, 170, 65] },
  { shape: "line", data: [160, 80, 150, 90] },
  { shape: "line", data: [160, 80, 170, 90] },
]
const AWARDS = [
  { range: [0, 1], label: "Bravo vous avez trouvé en # coups!" },
  { range: [1, 5], label: "Bien joué vous avez trouvé en # coups!" },
  { range: [5, 26], label: "Vous avez trouvé en # coups. Vous avez de la marge pour vous améliorer." },
]

class App extends Component {

  static initKeyboard() {
    let line = []
    KEYS.split('').map((letter, index) => {
      let i = index + 1
      line.push(letter)
      if (i % KEYBOARD_WIDTH === 0 || i === KEYS.length) {
        KEYBOARD.push(line)
        line = []
      }
      return true
    })
  }

  // nombre de lettres différentes dans un tableau de lettres
  static nbOfDifferentLetters(arrayOfLetters) {
    let minKeySet = new Set(arrayOfLetters)
    SEPARATORS.split('').map((letter) => minKeySet.delete(letter))
    return minKeySet.size
  }

  constructor(props) {
    super(props)
    App.initKeyboard()
  }

  state = {
    phrase: {},
    guesses: 0,
    missed: 0,
    matchedLetters: [],
    pressedKeys: [],
    players: PLAYERS,
    tour: 0,
    newMatch: true,
    gameOver: true,
    won: false,
    usedPhrases: [],
  }

  // nouvelle partie
  initNewMatch() {
    this.setState({
      newMatch: true,
      tour: 0,
    })
    PLAYERS.forEach((player) => {
      player.found = 0
      player.missed = 0
      player.strike = 0
      player.hanged = 0
      player.won = 0
    })
  }

  playerForm() {
    const { players } = this.state
    return (
      <div>
        <PlayerForm
          players={players}
          onChange={this.handlePlayerNameChange}
          onClick={this.startNewRound}
        />
      </div>
    )
  }

  handlePlayerNameChange = (event) => {
    const { players } = this.state
    const target = event.target
    const index = target.name
    players[index].name = target.value
  }

  // nouvelle manche
  // fonction fléchée pour conserver le this
  startNewRound = () => {
    const { newMatch, won } = this.state
    // le joueur qui a gagné la précédente manche commence
    if (!newMatch && !won) {
      this.setState({ tour: this.nextPlayer() })
    }
    this.setState({
      phrase: this.generatePhrase(),
      guesses: 0,
      missed: 0,
      matchedLetters: [],
      pressedKeys: [],
      gameOver: false,
      newMatch: false,
      won: false,
    })
    PLAYERS.forEach((player) => {
      player.found = 0
      player.missed = 0
    })
    this.clearPendu()
  }

  generatePhrase() {
    const { usedPhrases } = this.state
    let newUsedPhrases = usedPhrases
    const arrayOfLetters = []
    // trouver une nouvelle phrase
    let phraseIndex = Math.floor(Math.random() * PHRASES.length)
    while (usedPhrases.includes(phraseIndex)) {
      phraseIndex = Math.floor(Math.random() * PHRASES.length)
    }
    newUsedPhrases = [...usedPhrases, phraseIndex]
    // mettre à jour la liste des phrases déja utilisées
    if (newUsedPhrases.length === PHRASES.length) {
      newUsedPhrases = []
    }
    this.setState({ usedPhrases: newUsedPhrases })
    // retourner l'objet phrase : le tableau de lettres et le nombre de lettres différentes
    console.log(PHRASES[phraseIndex])
    PHRASES[phraseIndex].split('').map((letter) => arrayOfLetters.push(letter))
    return { label: arrayOfLetters, minKey: App.nbOfDifferentLetters(arrayOfLetters) }
  }

  getFeedbackForLetter(letter) {
    const { matchedLetters } = this.state
    if (SEPARATORS.split('').includes(letter)) {
      return 'separator'
    } else {
      return matchedLetters.includes(letter) ? 'visible' : 'hidden'
    }
  }

  // fonction fléchée pour conserver le this
  handleKeyClick = (letter) => {
    const { phrase, guesses, missed, matchedLetters, pressedKeys, players, tour } = this.state
    let player = players[tour]
    let newGuesses = guesses
    let newMissed = missed
    let newMatchedLetters = matchedLetters
    let newPressedKeys = pressedKeys

    if (pressedKeys.includes(letter)) {
      return
    }

    newGuesses++
    this.setState({ guesses: newGuesses })

    if (phrase.label.includes(letter)) {
      player.found++
      newMatchedLetters = [...matchedLetters, ...letter]
      this.setState({ matchedLetters: newMatchedLetters })
    } else {
      newMissed++
      player.missed++
      this.setState({ missed: newMissed })

      if (newMissed < PENDU_SHAPES.length) {
        this.drawPendu(newMissed)
        this.setState({ tour: this.nextPlayer() })
      }
    }

    if (!pressedKeys.includes(letter)) {
      newPressedKeys = [...pressedKeys, ...letter]
      this.setState({ pressedKeys: newPressedKeys })
    }
    // won
    if (newMatchedLetters.length === phrase.minKey) {
      player.won++
      // strike
      if (player.missed === 0 && player.found === phrase.minKey) {
        player.strike++
      }
      this.setState({ gameOver: true, won: true })
    }
    // pendu
    if (newMissed === PENDU_SHAPES.length) {
      player.hanged++
      this.drawPendu(newMissed)
      this.setState({ gameOver: true, won: false })
    }

  }

  drawPendu(missed) {
    const canvas = document.getElementById("myCanvas")
    const ctx = canvas.getContext("2d")
    ctx.lineWidth = 2
    const draw = PENDU_SHAPES[missed - 1]
    if (draw.shape === 'line') {
      ctx.beginPath();
      const x = draw.data[0]
      const y = draw.data[1]
      const X = draw.data[2]
      const Y = draw.data[3]
      ctx.moveTo(x, y)
      ctx.lineTo(X, Y)
      ctx.stroke()
    }
    if (draw.shape === 'circle') {
      ctx.beginPath();
      const x = draw.data[0]
      const y = draw.data[1]
      const radius = draw.data[2]
      const startAngle = draw.data[3]
      const endAngle = draw.data[4] * Math.PI
      ctx.arc(x, y, radius, startAngle, endAngle)
      ctx.stroke()
    }
  }

  clearPendu() {
    const canvas = document.getElementById("myCanvas")
    if (canvas) {
      let ctx = canvas.getContext("2d")
      ctx.clearRect(0,0,canvas.width, canvas.height)
    }

  }

  getFeedbackForKey(letter) {
    const { pressedKeys } = this.state
    return pressedKeys.includes(letter) ? 'pressed' : 'never_pressed'
  }

  displayKeyboard() {
    return (
      <div className="pendu keyboard">
        {KEYBOARD.map((line, index) => (
          <div key={index}>
            {line.map((letter, index) => (
              <Key
                key={index}
                letter={letter}
                feedback={this.getFeedbackForKey(letter)}
                onClick={this.handleKeyClick}
              />
            ))}
          </div>
        ))
        }
      </div>
    )
  }

  displayScoreBoard() {
    const { players, tour } = this.state
    return (
      <div className="pendu players">
        <table>
          <tbody>
            <tr>
              <th>Joueur</th>
              <th>Trouvés</th>
              <th>Manqués</th>
              <th>"Strikes"</th>
              <th>Pendus</th>
              <th>Manches</th>
            </tr>
            {players.map((player, index) => (
              <Player
                key={index}
                index={index}
                name={player.name}
                found={player.found}
                missed={player.missed}
                strike={player.strike}
                hanged={player.hanged}
                won={player.won}
                tour={tour === index ? 'tour' : ''}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  nextPlayer() {
    const { tour } = this.state
    if ((tour + 1) === PLAYERS.length) {
      return 0
    } else {
      return tour + 1
    }
  }

  // saisie par le clavier
  _handleKeyDown = (event) => {
    const { gameOver, newMatch } = this.state
    const letter = String.fromCharCode(event.keyCode).toUpperCase()
    if (!gameOver && !newMatch && KEYS.split('').includes(letter)) {
      this.handleKeyClick(letter)
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
  }


  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown.bind(this));
  }

  displayPhrase() {
    const { phrase, guesses } = this.state
    return (
      <div className="pendu phrase">
        <GuessCount guesses={guesses} />
        {phrase.label.map((letter, index) => (
          <Letter
            key={index}
            letter={letter}
            feedback={this.getFeedbackForLetter(letter)}
          />
        ))
        }
      </div>
    )
  }

  endOfRound() {
    const { won } = this.state
    return (
      <div className="pendu">
        {won ? this.displayWinner() : this.displayHanged()}
        {this.displayButtons()}
      </div>
    )
  }

  displayWinner() {
    const { phrase, guesses, players, tour } = this.state
    const player = players[tour]
    let overtaking = guesses - phrase.minKey
    let label = ""
    AWARDS.forEach((AWARDS) => {
      if (overtaking >= AWARDS.range[0] && overtaking < AWARDS.range[1]) {
        label = AWARDS.label
      }
    })
    return (
      <div className="pendu winner">
        <p>{label.replace("#", guesses)}</p>
        {player.missed === 0 && player.found === phrase.minKey && <p>STRIKE!!!</p>}
        <p>{player.name} est le vainqueur.</p>
      </div>
    )
  }

  displayHanged() {
    const { players, tour } = this.state
    return (
      <div className="pendu hanged">
        <p>{players[tour].name} est pendu.</p>
      </div>
    )
  }

  displayButtons() {
    return (
      <div>
        <button className="pendu button" onClick={() => this.startNewRound()} >Nouvelle manche</button>
        <button className="pendu button" onClick={() => this.initNewMatch()} >Nouvelle partie</button>
      </div>
    )
  }

  play() {
    const { gameOver, missed } = this.state
    return (
      <div className="pendu">
        {this.displayPhrase()}
        {gameOver ? this.endOfRound() : this.displayKeyboard()}
        {this.displayScoreBoard()}
        <Drawings
          hidden={missed === 0}
        />
      </div>
    )
  }

  render() {
    const { newMatch } = this.state
    return (
      <div className="pendu">
        <p className="pendu title">Jeu du Pendu</p>
        {newMatch ? this.playerForm() : this.play()}
      </div>
    )
  }

}

export default App;
