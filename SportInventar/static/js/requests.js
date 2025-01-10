function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function addInventory() {
    const requestType = document.getElementById('requestType').value;
    const requestedItem = document.getElementById('requestedItem').value;
    const requestDesc = document.getElementById('requestDesc').value;

    // Очистка предыдущих выделений
    document.getElementById('requestType').style.border = '';
    document.getElementById('requestedItem').style.border = '';
    document.getElementById('requestDesc').style.border = '';

    let hasError = false; // Флаг для отслеживания наличия ошибок
    const errorMessageElement = document.getElementById('error-message'); // Элемент для сообщения об ошибке

    // Проверка каждого поля и выделение красным, если оно пустое
    if (!inventoryName) {
        document.getElementById('requestType').style.border = '1px solid red';
        hasError = true;
    }
    if (requestedItem === '') {
        document.getElementById('requestedItem').style.border = '1px solid red';
        hasError = true;
    } else {
        const select = document.getElementById('requestedItem');
        if (select.selectedIndex === 0) {
            select.style.border = '1px solid red';
            hasError = true;
        }
    }
    if (!requestDesc) {
        document.getElementById('requestDesc').style.border = '1px solid red';
        hasError = true;
    }

    // Если есть ошибки, выводим сообщение
    if (hasError) {
        errorMessageElement.textContent = 'Пожалуйста, введите все необходимые данные.';
        errorMessageElement.style.display = 'block';
        return;
    } else {
        errorMessageElement.textContent = ''; // Очищаем сообщение об ошибке, если все поля заполнены
        closeModal();
    }

    // Если все поля заполнены, отправляем
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const mymodal = document.getElementById("myModal");
    if (event.target === mymodal) {
        closeModal();
    }
}


// Получение данных из атрибутов тега script
let dataset = document.currentScript.dataset

let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0];

// Функция, выполняемая после загрузки страницы
$(function() {
    // Обработчик клика по кнопке добавления
    $('#createRequestBtn').on('click', function(e) {
        // Предотвращение стандартного поведения кнопки
        e.preventDefault();
        
        // Сериализация данных формы в строку
        let data = $("#createRequest").serialize();
        console.log(data);
        
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
                console.log(response)
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

    $("#confirm-button").on('click', function(e) {

        let data = {
            "csrfmiddlewaretoken": csrftoken.value,
            "items": {

            }
        }
        const checkboxes = document.querySelectorAll('.request-checkbox');
        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        for(let i = 0; i < checkedCheckboxes.length; i++) {
            data['items'][i]=checkedCheckboxes[i].getAttribute('data-id');
        }
        console.log(data)
       
        $.ajax({
            type: "POST",
            url: dataset['remurl'],
            data: data,
            success: function(response) {
                
                window.location.reload();
            }
        });
    });
})

function toggleInventoryView() {
    const inventoryList = document.querySelector('.requests-list');

    if (inventoryList.classList.contains('grid-view')) {
        // Переключаем на вид списка
        inventoryList.classList.remove('grid-view');
        inventoryList.classList.add('list-view');
    } else {
        // Переключаем на вид блоков
        inventoryList.classList.remove('list-view');
        inventoryList.classList.add('grid-view');
    }
}

function toggleCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-container');
    const deleteButton = document.querySelector('.delete-button');
    const selectAllButton = document.querySelector('.select-all-button');
    const removeButton = document.querySelector('.remove-button');

    // Переключение видимости чекбоксов
    checkboxes.forEach(checkboxContainer => {
        checkboxContainer.classList.toggle('hidden');
    });

    // Переключение видимости кнопки "Выделить все"
    selectAllButton.classList.toggle('hidden');
    removeButton.classList.toggle('hidden');

    // Изменение текста кнопки "Удалить"
    if (deleteButton.textContent === 'Удалить') {
        deleteButton.textContent = 'Отмена';
    } else {
        deleteButton.textContent = 'Удалить';
    }
}

function selectAllItems() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    const selectAllButton = document.querySelector('.select-all-button');

    // Проверка, все ли чекбоксы уже выделены
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    // Выделение или снятие выделения всех чекбоксов
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });

    // Изменение текста кнопки "Выделить все"
    selectAllButton.textContent = allChecked ? 'Выделить все' : 'Снять выделение';
}

function openNotChosenItemModal() {
    const modal = document.getElementById("NotChosenItemModal");
    modal.style.display = "block";
}

function closeNotChosenItemModal() {
    const modal = document.getElementById("NotChosenItemModal");
    modal.style.display = "none";
}

function openConfirmItemDelitionModal() {
    const modal = document.getElementById("ConfirmItemDelitionModal");
    modal.style.display = "block";
}

function closeConfirmItemDelitionModal() {
    const modal = document.getElementById("ConfirmItemDelitionModal");
    modal.style.display = "none";
}


function deleteInventory() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    if (checkedCheckboxes.length === 0) {
        openNotChosenItemModal();
        return;
    }

    openConfirmItemDelitionModal();
    // AJAX
}

