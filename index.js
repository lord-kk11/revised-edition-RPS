
// setup
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
const helpButton = document.getElementById('help-button')
const intro = document.getElementById('intro')
const closeButton = document.getElementById('remove-help')
const startScreen = document.getElementById('start-screen')
const startButton = document.getElementById('start-btn')
const gameContainer = document.getElementById('game-container')

const leftHandrock = new Image();
const rightHandrock = new Image();
const leftHandpaper = new Image();
const rightHandpaper = new Image();
const leftHandscissors = new Image();
const rightHandscissors = new Image();

leftHandrock.src = "left_rock.png";
rightHandrock.src = "right_rock.png";
leftHandpaper.src = "left_paper.png";
rightHandpaper.src = "right_paper.png";
leftHandscissors.src = "left_scissors.png";
rightHandscissors.src = "right_scissors.png";

let choices = ['Rock', 'Paper', 'Scissors'];
let Userscore = 0;
let hearts = document.querySelectorAll('.hearts');

// disable or enable play buttons
const ButtonONOFF = (isdisabled) => {
  mainButton.forEach(button => {
    button.disabled = isdisabled;
  });
};

// animation for hands
function animate() {
  gsap.fromTo([userImage.firstChild,comImage.firstChild],
    { scale:0.8, y: 30, duration: 0 },
    { scale:1, ease: "back", y: -30, duration: 0.7 }
  );
}

// heart animation
function animateHeart() {
  gsap.fromTo(".hearts",
    { ease: "Linear", scale: 1.4, duration: 0.3 },
    { ease: "linear", scale: 1, duration: 0.3 }
  );
}

// delay utility
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const checkRevive = () => {
    const hearts = document.querySelectorAll('.hearts'); // dynamic
    if (hearts.length === 0 && Userscore >= 50) {
        reviveButton.style.display = 'block';
    } else {
        reviveButton.style.display = 'none';
    }
};

// remove one heart when user loses
// 3. Call this after deleting a heart
const deleteheart = () => {
    const hearts = document.querySelectorAll('.hearts');
    if (hearts.length > 0) {
        hearts[0].remove();
    }
    checkRevive(); // check if revive button should appear
};


// check loss or revive state
function checkHearts() {
  hearts = document.querySelectorAll('.hearts');
  if (hearts.length === 0) {
    if (Userscore >= 50) {
      // allow revive
      reviveButton.style.display = 'block';
    } else {
      // no gems -> show loss modal
      lossContainer.style.display = 'block';
      ButtonONOFF(true);
    }
  }
}


helpButton.addEventListener('click', ()=>{
    intro.style.display = 'block'
})


closeButton.addEventListener('click',()=>{
    intro.style.display = 'none'
})


function wongame() {
     const hearts = document.querySelectorAll('.hearts'); // dynamic
    if (hearts.length > 0 && Userscore == 150) {
    vs.innerHTML = 'you won the game'
    ButtonONOFF(true)
}


}

// main game logic
mainButton.forEach((button) => {
  button.addEventListener('click', Startgame);
});

async function Startgame(e) {
  ButtonONOFF(true);
  let userChoice = e.target.id;
  let computerChoice = choices[Math.floor(Math.random() * choices.length)];
  let resultcombo = userChoice + computerChoice;



  userImage.innerHTML = '';
  comImage.innerHTML = '';

   if (userChoice === 'Rock') userImage.appendChild(leftHandrock);
  else if (userChoice === 'Paper') userImage.appendChild(leftHandpaper);
  else userImage.appendChild(leftHandscissors);

  if (computerChoice === 'Rock') comImage.appendChild(rightHandrock);
  else if (computerChoice === 'Paper') comImage.appendChild(rightHandpaper);
  else comImage.appendChild(rightHandscissors);


  animate()

  await delay(700)

  let userWin = ['RockScissors', 'PaperRock', 'ScissorsPaper'];
  let computerWin = ['ScissorsRock', 'RockPaper', 'PaperScissors'];
  let draw = ['RockRock', 'PaperPaper', 'ScissorsScissors'];

  console.log(`User: ${userChoice}, Computer: ${computerChoice}`);

  // WIN
  if (userWin.includes(resultcombo)) {
    vs.innerHTML = 'You Win';
    vs.style.color = 'green';
    Userscore += 10;
    gemsUnit.innerHTML = Userscore;


    if (resultcombo === 'RockScissors') {
      userImage.appendChild(leftHandrock);
      comImage.appendChild(rightHandscissors);
    } else if (resultcombo === 'PaperRock') {
      userImage.appendChild(leftHandpaper);
      comImage.appendChild(rightHandrock);
    } else if (resultcombo === 'ScissorsPaper') {
      userImage.appendChild(leftHandscissors);
      comImage.appendChild(rightHandpaper);
    }
  }

  // LOSE
  else if (computerWin.includes(resultcombo)) {
    vs.innerHTML = 'Com Win';
    vs.style.color = 'red';
    animateHeart();
    deleteheart();

    if (resultcombo === 'ScissorsRock') {
      userImage.appendChild(leftHandscissors);
      comImage.appendChild(rightHandrock);
    } else if (resultcombo === 'RockPaper') {
      userImage.appendChild(leftHandrock);
      comImage.appendChild(rightHandpaper);
    } else if (resultcombo === 'PaperScissors') {
      userImage.appendChild(leftHandpaper);
      comImage.appendChild(rightHandscissors);
    }
 
  }

  // DRAW
  else if (draw.includes(resultcombo)) {
    vs.innerHTML = 'Draw';
    vs.style.color = 'orange';

    if (resultcombo === 'RockRock') {
      userImage.appendChild(leftHandrock);
      comImage.appendChild(rightHandrock);
    } else if (resultcombo === 'PaperPaper') {
      userImage.appendChild(leftHandpaper);
      comImage.appendChild(rightHandpaper);
    } else if (resultcombo === 'ScissorsScissors') {
      userImage.appendChild(leftHandscissors);
      comImage.appendChild(rightHandscissors);
    }
  }

  // reset to default state
  await delay(1500);
  userImage.innerHTML = '';
  comImage.innerHTML = '';
  vs.innerHTML = 'VS';
  vs.style.color = 'black';
  wongame()
  userImage.appendChild(leftHandrock);
  comImage.appendChild(rightHandrock);
  ButtonONOFF(false);
}

// revive lives (if enough gems)
reviveButton.addEventListener('click', () => {
    if (Userscore >= 50) {
        Userscore -= 50;
        gemsUnit.innerHTML = Userscore;

        // restore hearts
        const maxLives = 5;
        heartsContainer.innerHTML = '';
        for (let i = 0; i < maxLives; i++) {
            const newHeart = document.createElement('div');
            newHeart.classList.add('hearts');
            heartsContainer.appendChild(newHeart);
        }

        reviveButton.style.display = 'none';
    }
});

// restart or stop on loss modal
yes.addEventListener('click', () => {
  window.location.reload();
});

no.addEventListener('click', () => {
  ButtonONOFF(true);
  lossContainer.style.display = 'none';
  vs.innerHTML = 'Game Over';
  vs.style.color = 'gray';
});


startButton.addEventListener("click", () => {
  // Play animation using GSAP
  gsap.to("#start-screen", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      startScreen.style.display = "none";
      gameContainer.style.display = "flex";
    }
  });
});
















