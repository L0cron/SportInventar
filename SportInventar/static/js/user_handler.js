

let dataset = document.currentScript.dataset;
$(function() {
    $("#sendauth").on('click', function(e) {
        e.preventDefault();
        let data = $('#authform').serialize();
        document.getElementById('sendauth').toggleAttribute('disabled')
        $.ajax({
            type: "POST",
            url: dataset['url'],
            data: data,
            success: function(response) {
                console.log(response)
                document.getElementById('sendauth').toggleAttribute('disabled')
                if(response['status'] == 'ok') {
                    window.location.reload();
                }
            }
        })
    })
})