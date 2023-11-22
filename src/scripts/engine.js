const state = {
	score: {
		player: 0,
		computer: 0,
		box: document.getElementById("score-points"),
	},
	cardSprites: {
		avatar: document.getElementById("card-image"),
		name: document.getElementById("card-name"),
		type: document.getElementById("card-type"),
	},
	fieldCards: {
		player: document.getElementById("player-field-card"),
		computer: document.getElementById("computer-field-card"),
	},
	playerSides: {
		player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
		computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
	},
	actions: {
		button: document.getElementById("next-duel"),
	},
};

const pathImages = "./src/assets/icons/";

const cardData = [
	{
		id: 0,
		name: "Blue Eyes White Dragon",
		type: "Paper",
		img: pathImages + "dragon.png",
		winOf: [1],
		loseOf: [2],
	},
	{
		id: 1,
		name: "Dark Magician",
		type: "Rock",
		img: pathImages + "magician.png",
		winOf: [2],
		loseOf: [0],
	},
	{
		id: 2,
		name: "Exodia",
		type: "Scissors",
		img: pathImages + "exodia.png",
		winOf: [0],
		loseOf: [1],
	},
	{
		id: 3,
		name: "Face para baixo",
		type: "None",
		img: pathImages + "card-back.png",
		winOf: [3],
		loseOf: [3],
	},
];

async function getRandomCardId() {
	const randomIndex = Math.floor(Math.random() * (cardData.length - 1));
	return randomIndex;
}

async function drawSelectedCard(cardId) {
	state.cardSprites.avatar.src = cardData[cardId].img;
	state.cardSprites.name.innerText = cardData[cardId].name;
	state.cardSprites.type.innerText = `Attribute: ${cardData[cardId].type}`;
}

async function removeAllCardsImages() {

  const { player1Box, computerBox } = state.playerSides;

	let imgElements = player1Box.querySelectorAll("img");
	imgElements.forEach((img) => img.remove());

	imgElements = computerBox.querySelectorAll("img");
	imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(cardId, computerCardId)
{
  let duelResults = "Empate";

  let playerCard = cardData[cardId];

  if (playerCard.winOf.includes(computerCardId))
  {
    duelResults = "Ganhou"
    await playAudio("win");
    state.score.player++;
  } else if (playerCard.loseOf.includes(computerCardId))
  {
    duelResults = "Perdeu"
    await playAudio("lose");
    state.score.computer++;
  }

  return duelResults;
}

async function drawButton(text)
{
  state.actions.button.innerText = text;
  state.actions.button.style.display = 'block';
}

async function updateScore()
{
  state.score.box.innerText = `Win: ${state.score.player} x Lose: ${state.score.computer}`;
}

async function hideCardDetails()
{
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.cardSprites.avatar.src = "";
}

async function showHideCardFieldsImage(value)
{
  state.fieldCards.player.style.display = value ? "block" : 'none';
  state.fieldCards.computer.style.display = value ? "block" : 'none';
}

async function drawCardsInField(cardId, computerCardId)
{
  
	state.fieldCards.player.src = cardData[cardId].img;
	state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function setCardsField(cardId) {
	await removeAllCardsImages();

	let computerCardId = await getRandomCardId();

  await showHideCardFieldsImage(true);
  await hideCardDetails();
  await drawCardsInField(cardId, computerCardId);

	let duelResults = await checkDuelResults(cardId, computerCardId);

	await updateScore();
	await drawButton(duelResults);
}

async function createCardImage(cardId, fieldSide) {
	const cardImage = document.createElement("img");
	cardImage.setAttribute("height", "100px");
	cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
	cardImage.setAttribute("data-id", cardId);
	cardImage.classList.add("card");

	if (fieldSide === state.playerSides.player1) {
		cardImage.addEventListener("click", () => {
			setCardsField(cardImage.getAttribute("data-id"));
		});

		cardImage.addEventListener("mouseover", () => {
			drawSelectedCard(cardId);
		});
	} else {
		cardImage.addEventListener("mouseover", () => {
			drawSelectedCard(3);
		});
	}

	return cardImage;
}

async function drawCards(count, fieldSide) {
	for (let i = 0; i < count; i++) {
		const randomCardId = await getRandomCardId();
		const cardImage = await createCardImage(randomCardId, fieldSide);

		document.getElementById(fieldSide).appendChild(cardImage);
	}
}

async function resetDuel()
{
  state.cardSprites.avatar.src = '';
  state.actions.button.style.display = 'none';

  init();
}

async function playAudio(status)
{
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.volume = 0.5;
  audio.play();
}

function init() {
  showHideCardFieldsImage(false);

	drawCards(5, state.playerSides.player1);
	drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById('bgm');
  bgm.volume = 0.01;
  bgm.play();
}

init();
