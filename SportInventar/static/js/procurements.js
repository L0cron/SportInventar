function searchMain() {
    var searchValue = document.getElementById('search').value;
    if(searchValue !== ""){
        var url = `buy\\${searchValue}`;
        window.location.href = url;
    }
}

function search() {
    var searchValue = document.getElementById('search').value;
    if(searchValue !== ""){
        var url = `${searchValue}`;
        window.location.href = url;
    }
}

function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}