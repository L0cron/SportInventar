function openEditWindow() {
    const modal = document.getElementById("editModal");
    modal.style.display = "block";
}

function closeEditWindow() {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
}  
let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0];
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
        if (data['users'].length != 0) {
            errorMessageElement.style.display = 'none';
            top_users = (data['users'].slice(0, 5).map(user => user['username']));
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