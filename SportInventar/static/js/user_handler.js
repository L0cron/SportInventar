

let dataset = document.currentScript.dataset;
$(function() {
    $("#sendauth").on('click', function(e) {
        e.preventDefault();
        let data = $('#authform').serialize();
        $.ajax({
            type: "POST",
            url: dataset['url'],
            data: data,
            success: function(response) {
                console.log(response)
                if(response['status'] == 'ok') {
                    window.location.reload();
                }
            }
        })
    })
})