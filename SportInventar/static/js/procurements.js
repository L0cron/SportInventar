function searchMain() {
    var searchValue = document.getElementById('search').value;
    var url = `buy\\${searchValue}`;
    window.location.href = url;
}

function search() {
    var searchValue = document.getElementById('search').value;
    var url = `${searchValue}`;
    window.location.href = url;
}