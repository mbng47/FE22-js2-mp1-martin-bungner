

const nameInp = document.querySelector('#name-inp');
const nameBtn = document.querySelector('#name-btn');
const nameh2 = document.querySelector('#name-h2');
const rsp = ["Sten", "Sax", "Påse"];
let computersChoice = 0;
let playersChoice = 0;
let computersPoints = 0;
let playersPoints = 0;
let username;

const baseURL = 'https://js2-mp1-ssp-default-rtdb.europe-west1.firebasedatabase.app/';
getHighscore()
    .then(displayHighscore);

nameBtn.addEventListener('click', getName);
function getName(event) {
    event.preventDefault();

    if (nameInp.value != 0) {
        nameh2.innerText = `Välj för att börja spela, ${nameInp.value}!`;
        document.querySelector('p').style.visibility = 'hidden';
        username = nameInp.value;
    }
}

const btnContainer = document.querySelector('#btn-container');
btnContainer.addEventListener('click', klunsa);
function klunsa(event) {

    if (event.target.tagName == 'BUTTON' && computersPoints < 1) {

        if (nameInp.value == 0) {
            document.querySelector('p').style.visibility = 'visible';
        }

        else {
            if (event.target.id == 'rock-btn') {
                playersChoice = rsp[0];
            }

            else if (event.target.id == 'scissor-btn') {
                playersChoice = rsp[1];
            }

            else if (event.target.id == 'paper-btn') {
                playersChoice = rsp[2];
            }

            document.querySelector('#player-kluns-h2').innerText = playersChoice;
            document.querySelector('#player-kluns-h2').style.visibility = 'visible';
            document.querySelector('#player-points-h2').style.visibility = 'visible';

            const randomiser = Math.floor(Math.random() * rsp.length);
            computersChoice = rsp[randomiser];
            document.querySelector('#computer-kluns-h2').innerText = computersChoice;
            document.querySelector('#computer-kluns-h2').style.visibility = 'visible';
            nameh2.innerText = `Välj för att börja spela, ${nameInp.value}!`;
            document.querySelector('p').style.visibility = 'hidden';
            username = nameInp.value;

            if (playersChoice == "Sten" && computersChoice == "Sax" || playersChoice == "Sax" && computersChoice == "Påse" || playersChoice == "Påse" && computersChoice == "Sten") {
                playersPoints++;
                document.querySelector('#player-points-h2').innerText = `${playersPoints} p`;
                document.querySelector('#player-kluns-h2').style.color = 'green';
                document.querySelector('#computer-kluns-h2').style.color = 'red';
            }

            else if (computersChoice == "Sten" && playersChoice == "Sax" || computersChoice == "Sax" && playersChoice == "Påse" || computersChoice == "Påse" && playersChoice == "Sten") {
                computersPoints++;
                document.querySelector('#computer-kluns-h2').style.color = 'green';
                document.querySelector('#player-kluns-h2').style.color = 'red';
                if (computersPoints == 1) {
                    document.querySelector('#winner-h2').innerText = "Du förlorade!";
                    document.querySelector('#winner-h2').style.visibility = 'visible';
                    document.querySelector('#reset-btn').style.visibility = 'visible';
                    putNewScore(username, playersPoints);
                }
            }

            else {
                document.querySelector('#computer-kluns-h2').style.color = 'red';
                document.querySelector('#player-kluns-h2').style.color = 'red';
            }
        }
    }
}

const resetBtn = document.querySelector('#reset-btn');
resetBtn.addEventListener('click', reset);
function reset() {

    playersPoints = 0;
    document.querySelector('#player-points-h2').innerText = `${playersPoints} p`;
    document.querySelector('#player-kluns-h2').style.visibility = 'hidden';
    document.querySelector('#player-points-h2').style.visibility = 'hidden';

    computersPoints = 0;
    document.querySelector('#computer-points-h2').style.visibility = 'hidden';
    document.querySelector('#computer-kluns-h2').style.visibility = 'hidden';

    document.querySelector('#winner-h2').style.visibility = 'hidden';
    document.querySelector('#reset-btn').style.visibility = 'hidden';
    nameInp.value = '';
    location.reload();
}

async function getHighscore() {

    const url = baseURL + 'highscore.json';

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function displayHighscore(dataPara) {

    const scoresArray = Object.values(dataPara);
    const sortedScores = scoresArray.sort(function (a, b) {
        return b.score - a.score;
    })

    const ol = document.getElementById('highscore-ol');
    for (let i = 0; i < 5; i++) {
        const li = document.createElement('li');
        li.innerText = `${sortedScores[i].name}: ${sortedScores[i].score} poäng`;
        ol.append(li);
    }
}

async function putNewScore(username, playersPoints) {

    const url = baseURL + 'highscore.json';

    let newScore = {
        name: username,
        score: playersPoints
    }

    const init = {
        method: 'POST',
        body: JSON.stringify(newScore),
        headers: {
            'Content-type': "application/json; charset=UTF-8"
        }
    }

    const response = await fetch(url, init);
    const data = await response.json();
}