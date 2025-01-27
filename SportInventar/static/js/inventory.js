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
    const inventoryOwner = document.getElementById('elastic').value;
    const times = parseInt(document.getElementById('quantility').value) || 1; // Получаем количество добавлений

    // Очистка предыдущих выделений
    document.getElementById('inventoryName').style.border = '';
    document.getElementById('inventoryStatus').style.border = '';
    document.getElementById('elastic').style.border = '';

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
    if (!inventoryOwner) {
        document.getElementById('elastic').style.border = '1px solid red';
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

    if (times === '') {
        times = 1;
    }

    for (let i = 0; i < times; i++) {
        // Создание объекта FormData из формы
        let formData = new FormData($("#addItemForm")[0]);

        // AJAX-запрос на добавление элемента
        $.ajax({
            type: "POST",
            url: dataset['url'],
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response['status'] == 'ok') {
                    console.log(response);
                    // Перезагрузка страницы
                    window.location.reload();
                } else {
                    console.log(response['status']);
                }
            },
            error: function() {
                console.error("Ошибка при отправке данных");
            }
        });
    }
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

times = document.getElementById('quantility')

// Функция, выполняемая после загрузки страницы
$(function() {

    $("#confirm-button").on('click', function(e) {

        let data = {
            "csrfmiddlewaretoken": csrftoken.value,
            "items": {

            }
        }
        const checkboxes = document.querySelectorAll('.inventory-checkbox');
        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
        for(let i = 0; i < checkedCheckboxes.length; i++) {
            data['items'][i]=checkedCheckboxes[i].getAttribute('data-id');
        }
       
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
    const inventoryList = document.querySelector('.inventory-list');

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
    const checkboxes = document.querySelectorAll('.inventory-checkbox');
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
    const checkboxes = document.querySelectorAll('.inventory-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    if (checkedCheckboxes.length === 0) {
        openNotChosenItemModal();
        return;
    }

    openConfirmItemDelitionModal();
}


function elasticSearch() {
    
    let val = document.getElementById('elastic').value;
    console.log(val);
    if(val == '') {
        results.innerHTML = '';
        return
    }

    let data = {
        "csrfmiddlewaretoken": csrftoken.value,
        "query": val
    }

    $.ajax({
        url: dataset['searchurl'],
        type: 'GET',
        data: data,

    success: function(data) {
        let errorMessageElement = document.getElementById('owner-error-message'); // Элемент для сообщения об ошибке
        top_users = (data['users'].slice(0, 5).map(user => user['username']));
        if (data['users'].length != 0) {
            errorMessageElement.style.display = 'none';
            console.log(top_users);
            displayResults(top_users);
            top_users = []
        } else {
            displayResults(top_users);
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = 'Пользователь не найден';
        }
        ;
    },
    error: function(xhr, status, error) {
        console.log('Ошибка поиска: ' + error);
    }

    });
}

function displayResults(resultsArray) {
    const resultsList = document.getElementById('resultsList');
    // Очищаем предыдущие результаты
    resultsList.innerHTML = '';
    
    // Если массив результатов пуст, выходим из функции
    if (resultsArray.length === 0) {
        return;
    }
    
    const elastic = document.getElementById('elastic');
    // Если поле ввода пустое, выходим из функции
    if (elastic.value === '') {
        return;
    }
    
    resultsArray.forEach(result => {
        const option = document.createElement('option'); // Создаем элемент option
        option.value = result; // Устанавливаем значение option
        resultsList.appendChild(option); // Добавляем option в datalist
    });

    // Устанавливаем фокус на поле ввода, чтобы показать подсказки
    elastic.focus();
}