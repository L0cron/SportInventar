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
let finishCheck = false;


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
    if(currentStep == 2) {
        if(!superuserCheck) {
            if(!nextButton.classList.contains('disabled')) {
                nextButton.classList.add('disabled')
            }
        } else {
            if(nextButton.classList.contains('disabled')) {
                nextButton.classList.remove('disabled')
            }
        }
    } else if(currentStep == 3) {
        if(!serverCfgCheck) {
            if(!nextButton.classList.contains('disabled')) {
                nextButton.classList.add('disabled')
            }
        } else {
            if(nextButton.classList.contains('disabled')) {
                nextButton.classList.remove('disabled')
            }
        }
    }
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
    if(currentStep == 1) {
        if(!databaseCheck) {
            if(!nextButton.classList.contains('disabled')) {
                nextButton.classList.add('disabled')
            }
        } else {
            if(nextButton.classList.contains('disabled')) {
                nextButton.classList.remove('disabled')
            }
        }
    } else if(currentStep == 2) {
        if(!superuserCheck) {
            if(!nextButton.classList.contains('disabled')) {
                nextButton.classList.add('disabled')
            }
        } else {
            if(nextButton.classList.contains('disabled')) {
                nextButton.classList.remove('disabled')
            }
        }
    } else if(currentStep == 3) {
        if(!serverCfgCheck) {
            if(!nextButton.classList.contains('disabled')) {
                nextButton.classList.add('disabled')
            }
        } else {
            if(nextButton.classList.contains('disabled')) {
                nextButton.classList.remove('disabled')
            }
        }
    }
}

const dbconnect =document.getElementsByName('dbconnect')[0]
const dbstatus =document.getElementsByName('dbstatus')[0]


const superusercheck =document.getElementsByName('superusercheck')[0]
const superuserstatus =document.getElementsByName('superuserstatus')[0]

const cfgcheck =document.getElementsByName('cfgcheck')[0]
const cfgstatus =document.getElementsByName('cfgstatus')[0]

const checkcreate =document.getElementsByName('checkcreate')[0]



const dataurls = document.currentScript.dataset
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0]

$(document).ready(function() {
    checkcreate.addEventListener('click', function(e) {
        e.preventDefault();
        checkcreate.setAttribute('disabled','true')
        finishCheck = false;

        let status1 = document.getElementById('status1')
        let status2 = document.getElementById('status2')
        let status3 = document.getElementById('status3')
        let status4 = document.getElementById('status4')
        let status5 = document.getElementById('status5')
        let status6 = document.getElementById('status6')
        

        let data1 = {'db':$('#setup-form1').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }

        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data1,
            success: function(e) {
                status1.textContent = e.status
                if(e.status == 'ok') {
                    status1.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })

        let data2 = {'superuser':$('#setup-form2').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }

        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data2,
            success: function(e) {
                status2.textContent = e.status
                if(e.status == 'ok') {
                    status2.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })

        let data3 = {'config':$('#setup-form3').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }

        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data3,
            success: function(e) {
                status3.textContent = e.status
                if(e.status == 'ok') {
                    status3.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })
        
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data1,
            success: function(e) {
                status4.textContent = e.status
                if(e.status == 'ok') {
                    status4.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })
        
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data2,
            success: function(e) {
                status5.textContent = e.status
                if(e.status == 'ok') {
                    status5.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data3,
            success: function(e) {
                status6.textContent = e.status
                if(e.status == 'ok') {
                    status6.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })

        finishCheck = true;
        if(finishButton.classList.contains('disabled')) {
            finishButton.classList.remove('disabled')
        }
        if(!backButton.classList.contains('disabled')) {
            backButton.classList.add('disabled')
        }

        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data3,
            success: function(e) {
                status6.textContent = e.status
                if(e.status == 'ok') {
                    status6.style.color = 'green'
                    // checksPassed+=1;
                }
            }
        })

        let csrf = document.getElementsByName('csrfmiddlewaretoken')[0];
        let data = {
            'csrfmiddlewaretoken': csrf.value,
            "migrate":"1"
        }
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data,
            success: function(e) {
                console.log("Succes!")
            }
        })

        
        // if(checksPassed != 6) {
        checkcreate.removeAttribute('disabled')

        // }
        
    })

    dbconnect.addEventListener('click', function(e) {
        e.preventDefault();
        dbconnect.setAttribute('disabled','true')
        dbstatus.style.color = 'black'
        dbstatus.textContent = 'Подключение...'
        databaseCheck = false;
        if(!nextButton.classList.contains('disabled')) {
            nextButton.classList.add('disabled')
        }
        let data = {'db':$('#setup-form1').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }
        
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data,
            success: function(e) {
                dbconnect.removeAttribute('disabled')
                dbstatus.textContent = e.status
                if(e.status == 'ok') {
                    dbstatus.style.color = 'green'
                    databaseCheck = true;
                    if(nextButton.classList.contains('disabled')) {
                        nextButton.classList.remove('disabled')
                    }
                }
            }
        })
    })

    superusercheck.addEventListener('click', function(e) {
        e.preventDefault();
        superusercheck.setAttribute('disabled','true')
        superuserstatus.style.color = 'black'
        superuserstatus.textContent = 'Проверка...'
        superuserCheck = false;
        if(!nextButton.classList.contains('disabled')) {
            nextButton.classList.add('disabled')
        }
        let data = {'superuser':$('#setup-form2').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data,
            success: function(e) {
                superusercheck.removeAttribute('disabled')
                superuserstatus.textContent = e.status
                if(e.status == 'ok') {
                    superuserstatus.style.color = 'green'
                    superuserCheck = true;
                    if(nextButton.classList.contains('disabled')) {
                        nextButton.classList.remove('disabled')
                    }
                }
            }
        })
    })

    cfgcheck.addEventListener('click', function(e) {
        e.preventDefault();
        cfgcheck.setAttribute('disabled','true')
        cfgstatus.style.color = 'black'
        cfgstatus.textContent = 'Проверка...'
        serverCfgCheck = false;
        if(!nextButton.classList.contains('disabled')) {
            nextButton.classList.add('disabled')
        }
        let data = {'config':$('#setup-form3').serialize(),
            'csrfmiddlewaretoken':csrftoken.value
        }
        $.ajax({
            method: 'post',
            url: dataurls['setup_url'],
            data: data,
            success: function(e) {
                cfgcheck.removeAttribute('disabled')
                cfgstatus.textContent = e.status
                if(e.status == 'ok') {
                    cfgstatus.style.color = 'green'
                    serverCfgCheck = true;
                    if(nextButton.classList.contains('disabled')) {
                        nextButton.classList.remove('disabled')
                    }
                }
            }
        })
    })
})