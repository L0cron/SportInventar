function openEditWindow() {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";
}

function closeEditWindow() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
}  
let dataset = document.currentScript.dataset;
function editInventory() {
    // Сбор данных из формы
    
    let data = $('#itemForm').serialize();

    // Отправка данных через AJAX
    $.ajax({
        type: "POST",
        url: dataset['url'], // Убедитесь, что этот URL настроен на сервере
        data: data,
        success: function(response) {
            // Обработка успешного ответа
            alert("Инвентарь успешно обновлен!");
            closeEditWindow(); // Закрытие модального окна
            location.reload(); // Перезагрузка страницы для отображения обновленных данных
        },
        error: function(xhr, status, error) {
            // Обработка ошибки
            alert("Произошла ошибка при обновлении инвентаря: " + error);
        }
    });
}