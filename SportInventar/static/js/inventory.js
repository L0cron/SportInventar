function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function addInventory() {
    const inventoryName = document.getElementById('inventoryName').value;
    const inventoryStatus = document.getElementById('inventoryStatus').value;
    const inventoryOwnerFirstName = document.getElementById('inventoryOwnerFirstName').value;
    const inventoryOwnerLastName = document.getElementById('inventoryOwnerLastName').value;

    if (inventoryName && inventoryOwnerFirstName && inventoryOwnerLastName) {
        const inventoryList = document.querySelector('.inventory-list');
        const newItem = document.createElement('div');
        newItem.className = 'inventory-item';
        newItem.innerHTML = `
            <h3>${inventoryName}</h3>
            <p>Статус: ${inventoryStatus}</p>
            <p>Владелец: ${inventoryOwnerFirstName} ${inventoryOwnerLastName}</p>
        `;
        inventoryList.appendChild(newItem);
        document.getElementById('inventoryName').value = '';
        document.getElementById('inventoryStatus').value = '';
        document.getElementById('inventoryOwnerFirstName').value = '';
        document.getElementById('inventoryOwnerLastName').value = '';
        closeModal();
        alert('Инвентарь успешно добавлен!'); // User feedback
    } else {
        alert('Пожалуйста, введите все необходимые данные.');
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal();
    }
}

let dataset = document.currentScript.dataset
$(document).ready(function() {
    $("#addButton").on('click', function(e) {
        e.preventDefault();
        let data = $('#addItemForm').serialize()
        $.ajax({
            url: dataset['url'],
            method: 'POST',
            data: data,
            success: function(e) {
                addInventory();
            }
        })
    })
})