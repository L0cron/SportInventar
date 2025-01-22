
let dataset =document.currentScript.dataset;
$(function() {
    // Fill checkboxes
    var inputs = document.querySelectorAll('input');
    let data = {}
    inputs.forEach(function(input) {
        if (input.type === 'checkbox') {
            data[input.name] = input.checked;
        }

        // add event listener
        input.addEventListener('change', function(e) {
            sendSetting(input);
        })
    });
    $.ajax({
        type: "GET",
        data:data,
        url:dataset['url-get'],
        success: function(response) {
            console.log(response);
        }
    })

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
            url:dataset['url-set'],
            success: function(response) {
                console.log(response);
            }
        });
    }
})