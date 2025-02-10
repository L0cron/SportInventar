function searchMain() {
    var searchValue = document.getElementById('search').value;
    if(searchValue !== ""){
        var url = `buy\\${searchValue}`;
        window.location.href = url;
    }
}

let dataset = document.currentScript.dataset
let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0];

function search() {
    var searchValue = document.getElementById('search').value;
    if(searchValue !== ""){
        var url = `${searchValue}`;
        window.location.href = url;
    }
}

function openModalRed(itemJson = null) {
    let item = null;
    $.ajax({
        type: "POST",
        url: dataset,
    })
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}


// Функция, выполняемая после загрузки страницы
$(function() {
    // Обработчик клика по кнопке добавления
    $('#createProcurementBtn').on('click', function(e) {
        // Предотвращение стандартного поведения кнопки
        e.preventDefault();
        
        // Сериализация данных формы в строку
        let data = $("#addItemForm").serialize();
        console.log(data)
        
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
                    createProcurement();
                    window.location.reload()
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
        const checkboxes = document.querySelectorAll('.procurement-checkbox');
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

function createProcurement() {
    var name = document.getElementById('name').value;
    var amount = document.getElementById('amount').value;

    document.getElementById('name').style.border = '';
    document.getElementById('amount').style.border = '';
    let hasError = false;
    const errorMessageElement = document.getElementById('error-message');

    if (!name) {
        document.getElementById('name').style.border = '1px solid red';
        hasError = true;
    }
    if (!amount) {
        document.getElementById('amount').style.border = '1px solid red';
        hasError = true;
    }
    if (hasError) {
        errorMessageElement.textContent = 'Пожалуйста, введите все необходимые данные.';
        errorMessageElement.style.display = 'block';
        return;
    } else {
        errorMessageElement.textContent = ''; // Очищаем сообщение об ошибке, если все поля заполнены
        closeModal();
    }
}

function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function openModalFilled(item) {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
    console.log(item)
    document.getElementById('requestDesc').value = item;
}


function createProcurementAfterSearch(name, url, price, supplier, photoPath) {
    console.log(1)
    // Создаем объект с данными для отправки на сервер
    let data = {
        "csrfmiddlewaretoken": csrftoken.value,
        "name": name,            // Имя товара
        "url": url,
        "amount": 1,          // Ссылка на товар
        "price": price,          // Цена товара
        "supplier": supplier,    // Поставщик
        "photoPath": photoPath   // Путь к изображению
    };

    // Отправляем данные на сервер с помощью AJAX
    $.ajax({
        type: "POST",
        url: dataset['url'], // URL для создания записи в базе данных
        data: data,
        success: function(response) {
            if (response['status'] == 'ok') {
                console.log('Запись успешно создана');
                // Обновляем страницу или выполняем другие действия
                //window.location.href = dataset['url'];
                console.log(data)
            } else {
                // Обработка ошибки
                console.error('Ошибка при создании записи');
            }
        },
        error: function(xhr, status, error) {
            // Обработка ошибки
            console.error('Ошибка при отправке запроса:', error);
        }
    });
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
