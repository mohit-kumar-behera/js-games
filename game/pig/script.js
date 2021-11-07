'use strict';

const player_0 = document.querySelector('.player--0');
const player_1 = document.querySelector('.player--1');
const score_P0 = document.querySelector('#score--0');
const score_P1 = document.getElementById('score--1');
const current_P0 = document.getElementById('current--0');
const current_P1 = document.getElementById('current--1');
const status_P0 = document.querySelector('.status--0');
const status_P1 = document.querySelector('.status--1');

const diceImg = document.querySelector('.dice');

const rollDiceBtn = document.querySelector('.btn--roll');
const newGameBtn = document.querySelector('.btn--new');
const holdScoreBtn = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing;

const init = function () {
  scores = [0, 0]; // [player1_Score, player2_Score];
  activePlayer = 0;
  currentScore = 0;
  playing = true; // play the game as no player has been yet declared winner

  score_P0.textContent = 0;
  score_P1.textContent = 0;
  current_P0.textContent = 0;
  current_P1.textContent = 0;
  status_P0.textContent = '';
  status_P1.textContent = '';

  diceImg.classList.add('hidden');
  player_0.classList.remove('player--winner');
  player_1.classList.remove('player--winner');
  player_0.classList.add('player--active'); //default active player
  player_1.classList.remove('player--active');
};
init();

const switchPlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  activePlayer = Number(!activePlayer); // change the active player
  player_0.classList.toggle('player--active');
  player_1.classList.toggle('player--active');
};

//Active player rolls the dice
rollDiceBtn.addEventListener('click', function () {
  if (playing) {
    const diceThrown = Math.trunc(Math.random() * 6) + 1;

    diceImg.classList.remove('hidden');
    diceImg.setAttribute('src', `img/dice-${diceThrown}.png`);

    if (diceThrown !== 1) {
      //continue the active players game
      currentScore += diceThrown;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      //discontinue the active player game
      switchPlayer();
    }
  }
});

//Active player holds the score
holdScoreBtn.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      //active Player wins the game
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document.querySelector(`.status--${activePlayer}`).textContent = 'winner';
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }
  }
});

//Reset the game
newGameBtn.addEventListener('click', init);
