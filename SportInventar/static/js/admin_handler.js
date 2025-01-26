
let dataset =document.currentScript.dataset;
$(function() {
    // Fill checkboxes
    var inputs = document.querySelectorAll('input');
    

    $.ajax({
        type: "GET",
        data:{},
        url:dataset['urlGet'],
        success: function(response) {
            applySettings(response['settings']);
        }
    })

    function applySettings(settings) {
        inputs.forEach(function(input) {
            if (input.type === 'checkbox') {
                input.checked = settings[input.name];
            }
    
            // add event listener
            input.addEventListener('change', function(e) {
                sendSetting(input);
            })
            
        });
    }

    function sendSetting(input) {
        let data = {}
        if (input.type === 'checkbox') {        
            data[input.name] = input.checked;
        } else {
            data[input.name] = input.value;
        }
        $.ajax({
            type: "GET",
            data:data,
            url:dataset['urlSet'],
            success: function(response) {
                console.log(response);
            }
        });
    }
})