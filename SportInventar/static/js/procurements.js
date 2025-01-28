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
    console.log('dfsdfsdsfddd');
    let item = null;

    $.ajax({
        type: "POST",
        url: dataset,
    })
}

// function openModal(item = null) {
//     console.log('dfsdfsdsfddd   ')
//     if (item !== null) {
//         document.getElementById('productName').value = item.name;
//         document.getElementById('quantility').value = 1;
//         document.getElementById('urlka').value = item.url;
//         document.getElementById('photoPather').value = item.photoPath;
//     }
//     const modal = document.getElementById("myModal");
//     modal.style.display = "block";
// }

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
        console.log('dfbrjb')
        return;
    } else {
        console.log('assasassasassaaaa')
        errorMessageElement.textContent = ''; // Очищаем сообщение об ошибке, если все поля заполнены
        closeModal();
    }
}

function openModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}