// ==== ELEMENTS SETUP ====
const mainButton = document.querySelectorAll('.main-button');
const gemsUnit = document.getElementById('gems-unit');
const vs = document.getElementById('vs');
const userImage = document.getElementById('user-img');
const comImage = document.getElementById('com-img');
const lossContainer = document.getElementById('loss-container');
const reviveButton = document.getElementById('buy-lives');
const yes = document.getElementById('y');
const no = document.getElementById('n');
const heartsContainer = document.getElementById('hearts-container');
const buttonContainer = document.getElementById('button-container');
const helpButton = document.getElementById('help-button');
const intro = document.getElementById('intro');
const closeButton = document.getElementById('remove-help');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');

// ==== HAND IMAGES ====
const handImages = {
  left: {
    Rock: new Image(),
    Paper: new Image(),
    Scissors: new Image()
  },
  right: {
    Rock: new Image(),
    Paper: new Image(),
    Scissors: new Image()
  }
};

handImages.left.Rock.src = "left_rock.png";
handImages.left.Paper.src = "left_paper.png";
handImages.left.Scissors.src = "left_scissors.png";
handImages.right.Rock.src = "right_rock.png";
handImages.right.Paper.src = "right_paper.png";
handImages.right.Scissors.src = "right_scissors.png";

// ==== SOUNDS ====
const hearstsound = new Audio('259704__mattskydoodle__pop-human-mouth-effect.mp3');
const gemSound = new Audio('506053__mellau__button-click-2.wav');
const revivesound = new Audio('156859__multimax2121__button-1.wav');

// ==== GAME VARIABLES ====
let choices = ['Rock', 'Paper', 'Scissors'];
let Userscore = 0;
let hearts = document.querySelectorAll('.hearts');

// ==== UTILITY FUNCTIONS ====
const ButtonONOFF = (isdisabled) => {
  mainButton.forEach(button => button.disabled = isdisabled);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ==== HEART ANIMATION ====
function breakHeart(heartElement) {
  const rect = heartElement.getBoundingClientRect();
  const left = document.createElement("span");
  const right = document.createElement("span");
  left.className = "broken-half";
  right.className = "broken-half";

  left.style.position = "fixed";
  right.style.position = "fixed";
  left.style.left = rect.left + "px";
  left.style.top = rect.top + "px";
  right.style.left = rect.left + "px";
  right.style.top = rect.top + "px";

  document.body.appendChild(left);
  document.body.appendChild(right);
  heartElement.style.opacity = "0";

  gsap.timeline()
    .to([left, right], { y: 80, duration: 3, ease: "power1.in" }, 0.2)
    .to(left, { x: -20, y: 100, rotation: -5, opacity: 0, duration: 1, ease: "power2.out" }, 0)
    .to(right, { x: 20, y: 100, rotation: 5, opacity: 0, duration: 1, ease: "power2.out" }, 0)
    .add(() => {
      left.remove();
      right.remove();
      heartElement.remove();
      hearts = document.querySelectorAll('.hearts'); // update global
      checkHearts();
    });
}

// Remove one heart
const deleteheart = () => {
  if (hearts.length > 0) {
    breakHeart(hearts[0]);
    animateHeart();
    hearstsound.play();
  }
};

// Check hearts for loss/revive
function checkHearts(){
  hearts = document.querySelectorAll('.hearts');

    if (hearts.length === 0) {
        if (Userscore >= 50) {
            // Player can revive
            reviveButton.style.display = 'flex';
            buttonContainer.style.display = 'none';
            revivesound.play();
        } else {
            // Player cannot revive → show loss modal
            lossContainer.style.display = 'block';
            buttonContainer.style.display = 'none';
        }

        // Disable main buttons immediately
        ButtonONOFF(true);
    } else {
        // Player has hearts → ensure buttons are enabled
        ButtonONOFF(false);
        reviveButton.style.display = 'none';
        lossContainer.style.display = 'none';
    }
};

// Animate hearts on lose
function animateHeart() {
  gsap.fromTo(".hearts", { scale: 1.4 }, { scale: 1, duration: 0.3, ease: "linear" });
}

// Animate hand choices
function animateHands() {
  const userHand = userImage.firstChild;
  const comHand = comImage.firstChild;
  if (userHand && comHand) {
    gsap.fromTo([userHand, comHand], { scale: 0.8, y: 30 }, { scale: 1, y: -30, ease: "back", duration: 0.7 });
  }
}

// Scale gems unit
function scalegemsunit() {
  gemsUnit.classList.add('unit');
  setTimeout(() => gemsUnit.classList.remove('unit'), 1000);
}

// ==== GAME LOGIC ====
async function Startgame(e) {
  ButtonONOFF(true);
  let userChoice = e.target.id;
  let computerChoice = choices[Math.floor(Math.random() * choices.length)];
  let resultcombo = userChoice + computerChoice;

  // Clear previous hands
  userImage.innerHTML = '';
  comImage.innerHTML = '';

  // Append cloned images
  userImage.appendChild(handImages.left[userChoice].cloneNode(true));
  comImage.appendChild(handImages.right[computerChoice].cloneNode(true));

  animateHands();
  await delay(700);

  const userWin = ['RockScissors', 'PaperRock', 'ScissorsPaper'];
  const computerWin = ['ScissorsRock', 'RockPaper', 'PaperScissors'];
  const draw = ['RockRock', 'PaperPaper', 'ScissorsScissors'];

  // WIN
  if (userWin.includes(resultcombo)) {
    vs.textContent = 'You Win';
    vs.style.color = 'green';
    Userscore += 10;
    gemsUnit.innerHTML = Userscore;
    gemSound.play();

    if (Userscore >= 150 && hearts.length > 0) {
      vs.textContent = 'You Won the Game!';
      buttonContainer.style.display = 'none';
    }
  }
  // LOSE
  else if (computerWin.includes(resultcombo)) {
    vs.textContent = 'Com Wins';
    vs.style.color = 'red';
    deleteheart();
  }
  // DRAW
  else if (draw.includes(resultcombo)) {
    vs.textContent = 'Draw';
    vs.style.color = 'orange';
  }

  // Reset hands after delay
  await delay(1500);
  userImage.innerHTML = '';
  comImage.innerHTML = '';
  vs.innerHTML = 'VS';
  vs.style.color = 'black';
  userImage.appendChild(handImages.left.Rock.cloneNode(true));
  comImage.appendChild(handImages.right.Rock.cloneNode(true));
  ButtonONOFF(false);
}

// ==== EVENT LISTENERS ====
mainButton.forEach(button => button.addEventListener('click', Startgame));

reviveButton.addEventListener('click', () => {
  if (Userscore >= 50) {
    Userscore -= 50;
    gemsUnit.innerHTML = Userscore;
    buttonContainer.style.display = 'flex';
    reviveButton.style.display = 'none';
    heartsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const newHeart = document.createElement('div');
      newHeart.classList.add('hearts');
      heartsContainer.appendChild(newHeart);
    }
    hearts = document.querySelectorAll('.hearts');
    checkHearts()
  }
});

yes.addEventListener('click', () => window.location.reload());

no.addEventListener('click', () => {
  ButtonONOFF(true);
  lossContainer.style.display = 'none';
  vs.textContent = 'Game Over';
  vs.style.color = 'gray';
});

helpButton.addEventListener('click', () => intro.style.display = 'block');
closeButton.addEventListener('click', () => intro.style.display = 'none');

startButton.addEventListener('click', () => {
  gsap.to("#start-screen", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      startScreen.style.display = "none";
      gameContainer.style.display = "flex";
      intro.style.display = 'block';

      checkHearts();
    }
  });
});

const removeHelpBtn = document.getElementById('remove-help');
const userInput = document.getElementById('user-input');

// Initially disable the button
removeHelpBtn.disabled = true;

// Enable/disable button based on input
userInput.addEventListener('input', () => {
    removeHelpBtn.disabled = userInput.value.trim() === '';
});

// Optional: store the player’s name when closing
removeHelpBtn.addEventListener('click', () => {
    const playerName = userInput.value.trim();
    if (playerName !== '') {
        console.log('Player Name:', playerName);
        intro.style.display = 'none';
        // You can now display the name somewhere in the game
        // e.g., document.getElementById('player-display-name').textContent = playerName;
          const player = document.getElementById('input-container')
          player.innerHTML = `${playerName}`
    }
});














