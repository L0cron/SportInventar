function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function addInventory() {
    const inventoryName = document.getElementById('inventoryName').value;
    const inventoryStatus = document.getElementById('inventoryStatus').value;
    const inventoryOwnerFirstName = document.getElementById('inventoryOwnerFirstName').value;
    const inventoryOwnerLastName = document.getElementById('inventoryOwnerLastName').value;

    // Очистка предыдущих выделений
    document.getElementById('inventoryName').style.border = '';
    document.getElementById('inventoryStatus').style.border = '';
    document.getElementById('inventoryOwnerFirstName').style.border = '';
    document.getElementById('inventoryOwnerLastName').style.border = '';

    let hasError = false; // Флаг для отслеживания наличия ошибок
    const errorMessageElement = document.getElementById('error-message'); // Элемент для сообщения об ошибке

    // Проверка каждого поля и выделение красным, если оно пустое
    if (!inventoryName) {
        document.getElementById('inventoryName').style.border = '1px solid red';
        hasError = true;
    }
    if (inventoryStatus === '') {
        document.getElementById('inventoryStatus').style.border = '1px solid red';
        hasError = true;
    } else {
        const select = document.getElementById('inventoryStatus');
        if (select.selectedIndex === 0) {
            select.style.border = '1px solid red';
            hasError = true;
        }
    }
    if (!inventoryOwnerFirstName) {
        document.getElementById('inventoryOwnerFirstName').style.border = '1px solid red';
        hasError = true;
    }
    if (!inventoryOwnerLastName) {
        document.getElementById('inventoryOwnerLastName').style.border = '1px solid red';
        hasError = true;
    }

    // Если есть ошибки, выводим сообщение
    if (hasError) {
        errorMessageElement.textContent = 'Пожалуйста, введите все необходимые данные.';
        return;
    } else {
        errorMessageElement.textContent = ''; // Очищаем сообщение об ошибке, если все поля заполнены
        closeModal();
    }

    // Если все поля заполнены, отправляем
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        closeModal();
    }
}


// Получение данных из атрибутов тега script
let dataset = document.currentScript.dataset

// Функция, выполняемая после загрузки страницы
$(document).ready(function() {
    // Обработчик клика по кнопке добавления
    $('#addButton').on('click', function(e) {
        // Предотвращение стандартного поведения кнопки
        e.preventDefault();
        
        // Сериализация данных формы в строку
        let data = $("#addItemForm").serialize();
        
        // AJAX-запрос на добавление элемента
        $.ajax({
            // Тип запроса
            type: "POST",
            // URL, на который отправляется запрос
            url: dataset['url'],
            // Данные, отправляемые с запросом
            data: data,
            // Функция, выполняемая при успешном ответе сервера
            success: function(response) {
                // Проверка статуса ответа
                if(response['status'] == 'ok') {
                    // Добавление элемента в инвентарь
                    addInventory();
                    // Перезагрузка страницы
                    window.location.reload();

                } else {
                    // TODO: обработка ошибки
                }
                
            }
        })
    })
})