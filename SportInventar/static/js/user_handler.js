

let dataset = document.currentScript.dataset;
$(function() {
    $("#reg").on('click', function(e) {
        e.preventDefault();
        let data = $('#regform').serialize();
        $.ajax({
            type: "POST",
            url: dataset['url'],
            data: data,
            success: function(response) {
                console.log(response)
            }
        })
    })
})