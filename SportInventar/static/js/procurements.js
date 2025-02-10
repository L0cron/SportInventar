// Search function to redirect to a specific URL based on search input
function searchMain() {
    const searchValue = document.getElementById('search').value.trim();
    if (searchValue) {
        const url = `buy/${searchValue}`; // Use forward slashes for URLs
        window.location.href = url;
    }
}

let dataset = document.currentScript.dataset
let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0];

// Search function without a predefined URL path
function search() {
    const searchValue = document.getElementById('search').value.trim();
    if (searchValue) {
        window.location.href = searchValue; // Redirect directly to the search value
    }
}

// Open a modal with optional item data (for editing or viewing)
function openModalRed(itemJson = null) {
    $.ajax({
        type: "POST",
        url: dataset.url, // Use dataset URL for the AJAX request
        data: { item: itemJson }, // Send itemJson if provided
        success: function(response) {
            // Handle success response (e.g., populate modal with data)
        },
        error: function(xhr, status, error) {
            console.error('Error opening modal:', error);
        }
    });
}

// Close the modal
function closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Function executed after the page loads
$(function() {
    // Click handler for adding procurement
    $('#createProcurementBtn').on('click', function(e) {
        e.preventDefault(); // Prevent default form submission
        const data = $("#addItemForm").serialize(); // Serialize form data

        // AJAX request to add item
        $.ajax({
            type: "POST",
            url: dataset.url,
            data: data,
            success: function(response) {
                if (response.status === 'ok') {
                    createProcurement();
                    window.location.href = dataset.url; // Redirect after success
                } else {
                    console.error('Error adding item:', response);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error during AJAX request:', error);
            }
        });
    });
});

// Validate and create procurement
function createProcurement() {
    const productName = document.getElementById('productName').value.trim();
    const quantity = document.getElementById('quantility').value.trim(); // Fixed typo from 'quantility' to 'quantity'
    const errorMessageElement = document.getElementById('error-message');
    let hasError = false;

    // Reset styles and error message
    document.getElementById('productName').style.border = '';
    document.getElementById('quantility').style.border = '';
    errorMessageElement.textContent = '';
    errorMessageElement.style.display = 'none';

    // Validate inputs
    if (!productName) {
        document.getElementById('productName').style.border = '1px solid red';
        hasError = true;
    }
    if (!quantity) {
        document.getElementById('quantility').style.border = '1px solid red';
        hasError = true;
    }

    if (hasError) {
        errorMessageElement.textContent = 'Пожалуйста, введите все необходимые данные.';
        errorMessageElement.style.display = 'block';
    } else {
        closeModal(); // Close modal if validation passes
    }
}

// Open the modal
function openModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "block";
    }
}

// Open the modal with pre-filled data
function openModalFilled(item) {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "block";
        document.getElementById('requestDesc').value = item; // Pre-fill the input field
    }
}

// Create procurement after search
function createProcurementAfterSearch(name, url, price, supplier, photoPath) {
    const data = {
        csrfmiddlewaretoken: csrftoken,
        name: name,
        url: url,
        amount: 1,
        price: price,
        supplier: supplier,
        photoPath: photoPath
    };

    $.ajax({
        type: "POST",
        url: dataset.url,
        data: data,
        success: function(response) {
            if (response.status === 'ok') {
                console.log('Запись успешно создана');
            } else {
                console.error('Ошибка при создании записи:', response);
            }
        },
        error: function(xhr, status, error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    });
}

// Toggle visibility of checkboxes and buttons
function toggleCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-container');
    const deleteButton = document.querySelector('.delete-button');
    const selectAllButton = document.querySelector('.select-all-button');
    const removeButton = document.querySelector('.remove-button');

    checkboxes.forEach(checkboxContainer => {
        checkboxContainer.classList.toggle('hidden');
    });

    selectAllButton.classList.toggle('hidden');
    removeButton.classList.toggle('hidden');

    // Toggle delete button text
    deleteButton.textContent = deleteButton.textContent === 'Удалить' ? 'Отмена' : 'Удалить';
}

// Open the confirmation modal for item deletion
function openConfirmItemDeletionModal() {
    const modal = document.getElementById("ConfirmItemDelitionModal");
    if (modal) {
        modal.style.display = "block";
    }
}

// Close the confirmation modal
function closeConfirmItemDeletionModal() {
    const modal = document.getElementById("ConfirmItemDelitionModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Delete selected inventory items
function deleteInventory() {
    const checkboxes = document.querySelectorAll('.inventory-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    const data = {
        csrfmiddlewaretoken: csrftoken.value,
        items: {}
    };

    checkedCheckboxes.forEach((checkbox, index) => {
        data.items[index] = checkbox.getAttribute('data-id');
    });

    $.ajax({
        type: "POST",
        url: dataset.remurl,
        data: data,
        success: function(response) {
            if (response.status === 'ok') {
                window.location.reload(); // Reload the page to reflect changes
            } else {
                console.error('Error deleting items:', response);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error deleting items:', error);
        }
    });
}