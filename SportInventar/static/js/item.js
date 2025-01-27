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
    
    const inventoryName = document.getElementById('inventoryName').value;
    const inventoryStatus = document.getElementById('inventoryStatus').value;
    const inventoryOwner = document.getElementById('elastic').value;

    // Очистка предыдущих выделений
    document.getElementById('inventoryName').style.border = '';
    document.getElementById('inventoryStatus').style.border = '';
    document.getElementById('elastic').style.border = '';

    let hasError = false; // Флаг для отслеживания наличия ошибок
    let errorMessageElement = document.getElementById('error-message'); // Элемент для сообщения об ошибке

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
    } 
    else {
        errorMessageElement.textContent = ''; // Очищаем сообщение об ошибке, если все поля заполнены
        let data = $('#itemForm').serialize();
        $.ajax({
            type: "POST",
            url: dataset['url'], // Убедитесь, что этот URL настроен на сервере
            data: data,
            headers: {
                'X-CSRFToken': csrftoken.value
            },
            success: function(response) {
                // Обработка успешного ответа
                closeEditWindow(); // Закрытие модального окна
                location.reload(); // Перезагрузка страницы для отображения обновленных данных
            },
            error: function(xhr, status, error) {
                alert("Произошла ошибка при обновлении инвентаря: " + error);
            }
        });
    }
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
     queueMicrotask
    resultsArray.forEach(result => {
        const option = document.createElement('option'); // Создаем элемент option
        option.value = result; // Устанавливаем значение option
        resultsList.appendChild(option); // Добавляем option в datalist
    });

    // Устанавливаем фокус на поле ввода, чтобы показать подсказки
    elastic.focus();
}