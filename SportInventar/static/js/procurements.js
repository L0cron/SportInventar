function searchMain() {
    var searchValue = document.getElementById('search').value;
    if (searchValue !== "") {
        var url = `buy\\${searchValue}`;
        window.location.href = url;
    }
}

let dataset = document.currentScript.dataset;
let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0];

function search() {
    var searchValue = document.getElementById('search').value;
    if (searchValue !== "") {
        var url = `${searchValue}`;
        window.location.href = url;
    }
}

// Функция для создания закупки
function createProcurement(item) {

    // Создаем объект с данными для отправки на сервер
    let data = {
        "csrfmiddlewaretoken": csrftoken.value,
        "name": item.name,  // Имя товара
        "url": item.href,            // Ссылка на товар
        "price": item.price,         // Цена товара
        "supplier": item.supplier,    // Поставщик
        "photoPath": item.photoPath   // Путь к изображению
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
                window.location.href = dataset['url'];
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