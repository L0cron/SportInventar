let currentStep = 1;
let maxStep = 4;

const progressBar = document.getElementsByClassName('progress-bar')[0]

const content1 = document.getElementById('content1');
const content2 = document.getElementById('content2');
const content3 = document.getElementById('content3');
const content4 = document.getElementById('content4');
const finishContent = document.getElementById('finish-content');

const backButton = document.getElementsByClassName('prev-button')[0]
const nextButton = document.getElementsByClassName('next-button')[0]
const finishButton = document.getElementsByClassName('finish-button')[0]


let contents = [content1,content2,content3,content4,finishContent]

let databaseCheck = false;
let superuserCheck = false;
let serverCfgCheck = false;


function progressStep() {
    progressBar.style.width = 100*((currentStep-1)/maxStep).toString()+'%';
}

const buttons = document.getElementsByClassName('button-container')[0]
function finish() {
    progressBar.style.width = '100%';
    buttons.classList.add('hidden')
    hideEveryithing(5)
}



function hideEveryithing(except) {
    contents.forEach(content => {
        if (content != contents[except-1]) {
            if (!content.classList.contains('hidden')) {
                content.classList.add('hidden')
            }
        } else {
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden')
            }
        }
    });
}

function nextStep() {
    currentStep+=1;
    if (currentStep >= maxStep) {
        currentStep = maxStep;
        nextButton.setAttribute('hidden','true')
        finishButton.removeAttribute('hidden');
    } else {
        backButton.removeAttribute('hidden')
    }

    hideEveryithing(currentStep)
    progressStep();
}

function prevStep() {
    currentStep+=-1;
    if (currentStep <= 1) {
        currentStep = 1;
        backButton.setAttribute('hidden','true')
    } else {
        finishButton.setAttribute('hidden','true')
        nextButton.removeAttribute('hidden')

    }
    hideEveryithing(currentStep)

    progressStep();
}

