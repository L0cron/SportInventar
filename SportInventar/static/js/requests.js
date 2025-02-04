function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function f1() {
    // Получаем выбранное значение из select
    const selectedValue = document.getElementById('requestedType').value;
    // Скрываем все дополнительные поля с id, соответствующим выбранному типу
    const types = document.querySelectorAll('[id^="type"]'); // Находим все элементы с id, начинающимся на "type"
    types.forEach(type => {
        type.classList.add('hidden'); // Скрываем все
    });
    // Очищаем поля ввода
    const inputField = document.getElementById('requestedItem'); // Поле для типа 0
    const selectField = document.querySelectorAll('select[name="requestedItem"]'); // Поля для типов 1 и 2
    // Очищаем текстовое поле
    inputField.value = '';
    // Очищаем все выпадающие списки
    selectField.forEach(select => {
        select.selectedIndex = 0; // Сбрасываем выбор на первый элемент
    });
    // Показываем только выбранное поле
    if (selectedValue !== "-1") {
        const selectedType = document.getElementById(`type${selectedValue}`);
        if (selectedType) {
            selectedType.classList.remove('hidden'); // Показываем только выбранный тип
        }
    }
}

function createRequest() {
    const requestType = document.getElementById('requestedType').value;
    const requestedItem = document.getElementById('requestedItem').value;
    const requestDesc = document.getElementById('requestDesc').value;

    // Очистка предыдущих выделений
    document.getElementById('requestedType').style.border = '';
    document.getElementById('requestedItem').style.border = '';
    document.getElementById('requestDesc').style.border = '';

    let hasError = false; // Флаг для отслеживания наличия ошибок
    const errorMessageElement = document.getElementById('error-message'); // Элемент для сообщения об ошибке

    // Проверка каждого поля и выделение красным, если оно пустое
    // if (!requestedItem) {
    //     document.getElementById('requestedItem').style.border = '1px solid red';
    //     hasError = true;
    // }
    if (requestType === '') {
        document.getElementById('requestedType').style.border = '1px solid red';
        hasError = true;
    } else {
        const select = document.getElementById('requestedType');
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
        data = data.replace('requestedItem=&', '');
        console.log(data)
        // AJAX-запрос на добавление элемента
        $.ajax({
            // Тип запроса
            type: "POST",
            // URL, на который отправляется запрос
            url: dataset['url'],
            // Данные, отправляемые с запросом
            data: data  ,
            // Функция, выполняемая при успешном ответе сервера
            success: function(response) {
                // Проверка статуса ответа
                if(response['status'] == 'ok') {
                    // Добавление элемента в инвентарь
                    createRequest();
                    // Перезагрузка страницы
                    // window.location.reload();

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
        const checkboxes = document.querySelectorAll('.requests-checkbox');
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
    const checkboxes = document.querySelectorAll('.requests-checkbox');
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
    const checkboxes = document.querySelectorAll('.requests-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    if (checkedCheckboxes.length === 0) {
        openNotChosenItemModal();
        return;
    }

    openConfirmItemDelitionModal();
    // AJAX
}

function toggleStatusSelect(button) {
    var select = button.nextElementSibling;
    var statusButtons = select.nextElementSibling;
    if (select.style.display === 'none') {
        select.style.display = 'block';
        statusButtons.style.display = "block";
        button.style.display = 'none';
    } else {
        select.style.display = 'none';
    }
    
    // Обработчик изменения статуса
    select.addEventListener('change', function() {
        const statusId = select.value;
        const itemId = button.getAttribute('data-id');
        
        // AJAX-запрос на изменение статуса
        $.ajax({
            type: "POST",
            url: dataset['statusurl'],
            data: {
                "csrfmiddlewaretoken": csrftoken.value,
                "status_id": statusId,
                "item_id": itemId
            },
            success: function(response) {
                if(response['status'] == 'ok') {
                    window.location.reload();
                }
            }
        });
    });
}

function cancelStatusChange(element) {
    var statusSelect = element.parentNode.previousElementSibling;
    var statusButton = statusSelect.previousElementSibling;
    statusSelect.style.display = "none";
    element.parentNode.style.display = "none";
    statusButton.style.display = "block";
}

function procurRedirect() {
    window.location.href = '/procur/';
}

function changeRequest(id,status,type) {
    $.ajax({
            type: 'POST',
            url: dataset['archive'],
            data: {
                "csrfmiddlewaretoken": document.querySelector('input[name="csrfmiddlewaretoken"]').value,
                "request_id": id,
                "request_status":status,
                "disp_type":type
            },
            success: function(response) {
                if(response['status'] == 'ok') {
                    window.location.reload()
                }
                else{
                    alert('Ошибка при изменении статуса.');
                }
            }
        }
    )
}

function completeRequest(id,req_type) {
    $.ajax({
            type: 'POST',
            url: dataset['complete'],
            data: {
                "csrfmiddlewaretoken": document.querySelector('input[name="csrfmiddlewaretoken"]').value,
                "request_id": id,
                "request_type": req_type
            },
            success: function(response) {
                if(response['status'] == 'ok') {
                    window.location.reload()
                }
                else{
                    alert('Ошибка при изменении статуса.');
                }
            }
        }
    )
}

function finder(array, to_f) {
    return array.filter(item => item.toLowerCase().includes(to_f.toLowerCase()));
}

function elasticSearch() {
    let val = document.getElementById('requestedItem').value;
    try {
        if(val == '') {
            results.innerHTML = '';
            return
        }
    } catch (e) {
        //console.log(e) // можно вывести ошибку если надо(нет)
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
        searches = finder(data['items'],val).slice(0,5);
        if (data['items'].length != 0) {
            errorMessageElement.style.display = 'none';
            displayResults(searches);
            searches = []
        } else {
            displayResults(searches);
            errorMessageElement.style.display = 'block';
            errorMessageElement.textContent = 'Экипировка не найдена';
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
    
    const elastic = document.getElementById('requestedItem');
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