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
                    console.log('yes')
                    // Добавление элемента в инвентарь
                    createProcurement();
                    window.location.href = dataset['url'];
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
    var productName = document.getElementById('productName').value;
    var quantility = document.getElementById('quantility').value;

    document.getElementById('productName').style.border = '';
    document.getElementById('quantility').style.border = '';
    let hasError = false;
    const errorMessageElement = document.getElementById('error-message');

    if (!productName) {
        document.getElementById('productName').style.border = '1px solid red';
        hasError = true;
    }
    if (!quantility) {
        document.getElementById('quantility').style.border = '1px solid red';
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