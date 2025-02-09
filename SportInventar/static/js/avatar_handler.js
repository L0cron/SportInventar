

let url = document.currentScript.dataset['url']
$(document).ready(function() {
    // Открытие модального окна
    $('#openModalButton').on('click', function() {
        $('#avatarModal').show();
    });

    // Закрытие модального окна
    $('#closeModal').on('click', function() {
        $('#avatarModal').hide();
    });
});



document.getElementById('avatarInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;

            const cropBox = document.getElementById('cropBox');
            cropBox.style.display = 'block';

            const confirmBtn = document.getElementById('confirmBtn');
            confirmBtn.disabled = false;

            setupCropping(previewImage, cropBox);
        };
        reader.readAsDataURL(file);
    }
});

function setupCropping(img, cropBox) {
    let isDragging = false;
    let offsetX, offsetY;

    // Получаем масштабированные размеры изображения
    function getScaledDimensions() {
        const container = img.parentElement;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = container.offsetWidth / container.offsetHeight;

        let scaledWidth, scaledHeight;

        if (imgRatio > containerRatio) {
            scaledWidth = container.offsetWidth;
            scaledHeight = container.offsetWidth / imgRatio;
        } else {
            scaledHeight = container.offsetHeight;
            scaledWidth = container.offsetHeight * imgRatio;
        }

        return { width: scaledWidth, height: scaledHeight };
    }

    // Обновляем позицию квадрата при изменении размера изображения
    function updateCropBoxPosition() {
        const scaled = getScaledDimensions();
        const containerRect = img.parentElement.getBoundingClientRect();
        const imgLeft = (containerRect.width - scaled.width) / 2;
        const imgTop = (containerRect.height - scaled.height) / 2;

        const maxX = scaled.width - cropBox.offsetWidth;
        const maxY = scaled.height - cropBox.offsetHeight;

        cropBox.style.left = Math.min(Math.max(parseFloat(cropBox.style.left || 0), 0), maxX) + imgLeft + 'px';
        cropBox.style.top = Math.min(Math.max(parseFloat(cropBox.style.top || 0), 0), maxY) + imgTop + 'px';
    }

    cropBox.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const scaled = getScaledDimensions();
            const containerRect = img.parentElement.getBoundingClientRect();
            const imgLeft = (containerRect.width - scaled.width) / 2;
            const imgTop = (containerRect.height - scaled.height) / 2;
    
            const x = e.clientX - containerRect.left - offsetX - imgLeft;
            const y = e.clientY - containerRect.top - offsetY - imgTop;
    
            const maxX = scaled.width - cropBox.offsetWidth;
            const maxY = scaled.height - cropBox.offsetHeight;
    
            cropBox.style.left = Math.min(Math.max(x, 0), maxX) + imgLeft + 'px';
            cropBox.style.top = Math.min(Math.max(y, 0), maxY) + imgTop + 'px';
    
            
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    const sizeSlider = document.getElementById('sizeSlider');
    sizeSlider.addEventListener('input', function() {
        const size = parseInt(sizeSlider.value);
        const scaled = getScaledDimensions();

        // Ограничиваем размер квадрата размерами изображения
        const maxSize = Math.min(scaled.width, scaled.height);
        const finalSize = Math.min(size, maxSize);

        cropBox.style.width = finalSize + 'px';
        cropBox.style.height = finalSize + 'px';
        updateCropBoxPosition();
    });

    // Обновляем позицию квадрата при загрузке изображения
    img.onload = function() {
        updateCropBoxPosition();
    };
}

document.getElementById('confirmBtn').addEventListener('click', function() {
    const previewImage = document.getElementById('previewImage');
    const cropBox = document.getElementById('cropBox');

    // Проверяем, что изображение загружено
    if (previewImage.naturalWidth === 0 || previewImage.naturalHeight === 0) {
        console.error("Изображение не загружено.");
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaled = getScaledDimensions();
    const containerRect = previewImage.parentElement.getBoundingClientRect();
    const imgLeft = (containerRect.width - scaled.width) / 2;
    const imgTop = (containerRect.height - scaled.height) / 2;

    // Получаем координаты квадрата относительно изображения
    const cropX = parseFloat(cropBox.style.left) - imgLeft;
    const cropY = parseFloat(cropBox.style.top) - imgTop;
    const cropSize = parseInt(cropBox.style.width);

    // Масштабируем координаты и размеры для оригинального изображения
    const scaleFactorX = previewImage.naturalWidth / scaled.width;
    const scaleFactorY = previewImage.naturalHeight / scaled.height;

    let originalCropX = cropX * scaleFactorX;
    let originalCropY = cropY * scaleFactorY;
    let originalCropSize = cropSize * scaleFactorX;

    if (isNaN(originalCropSize)) {
        originalCropSize = 100;
    }
    if (isNaN(originalCropX)) {
        originalCropX = 0;
    }
    if (isNaN(originalCropY)) {
        originalCropY = 0;
    }

    // Устанавливаем размеры canvas и вырезаем изображение
    canvas.width = originalCropSize;
    canvas.height = originalCropSize;

    

    console.log(previewImage,
        originalCropX, originalCropY, originalCropSize, originalCropSize, // Координаты и размеры на оригинальном изображении
        0, 0, originalCropSize, originalCropSize)

    ctx.drawImage(
        previewImage,
        originalCropX, originalCropY, originalCropSize, originalCropSize, // Координаты и размеры на оригинальном изображении
        0, 0, originalCropSize, originalCropSize // Координаты и размеры на canvas
    );

    const croppedImage = canvas.toDataURL('image/png');
    console.log(croppedImage); // Вывод в консоль для проверки

    // Отправляем изображение на сервер
    console.log(url)
    $.ajax({
        url: url, // Укажите URL, на который отправляется запрос
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            avatar: croppedImage, // Отправляем base64-строку
        }),
        headers: {
            'X-CSRFToken': '{{ csrf_token }}' // Передаем CSRF-токен в заголовках
        },
        success: function(data) {
            if (data.success) {
                window.location.reload(); // Перезагружаем страницу для отображения нового аватара
            } else {
                alert("Ошибка при обновлении аватара: " + data.error);
            }
        },
        error: function(xhr, status, error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Произошла ошибка при обновлении аватара.");
        }
    });
});

// Функция для получения масштабированных размеров изображения
function getScaledDimensions() {
    const img = document.getElementById('previewImage');
    const container = img.parentElement;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = container.offsetWidth / container.offsetHeight;

    let scaledWidth, scaledHeight;

    if (imgRatio > containerRatio) {
        scaledWidth = container.offsetWidth;
        scaledHeight = container.offsetWidth / imgRatio;
    } else {
        scaledHeight = container.offsetHeight;
        scaledWidth = container.offsetHeight * imgRatio;
    }

    return { width: scaledWidth, height: scaledHeight };
}

document.getElementById('avatarInput').addEventListener('change', function(event) {
    let item1 = document.getElementById('imageContainer')
    let item2 = document.getElementById('sliderName')
    let item3 = document.getElementById('sizeSlider')
    item1.style.display = '';
    item2.style.display = '';
    item3.style.display = '';

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;

            previewImage.onload = function() {
                console.log("Изображение загружено."); // Логируем загрузку изображения
                const cropBox = document.getElementById('cropBox');
                cropBox.style.display = 'block';

                const confirmBtn = document.getElementById('confirmBtn');
                confirmBtn.disabled = false;

                setupCropping(previewImage, cropBox);
            };
        };
        reader.readAsDataURL(file);
    }
});