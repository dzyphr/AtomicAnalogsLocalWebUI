
window.addEventListener("DOMContentLoaded", (event) => {
	setStyledAndFilterableDropDownLists()
});
function setStyledAndFilterableDropDownLists() {
    // Get all input fields and dropdowns
    const inputFields = document.querySelectorAll('.chosen-value');
    const dropdowns = document.querySelectorAll('.value-list');

    inputFields.forEach((inputField, index) => {
        const dropdown = dropdowns[index];
        const dropdownArray = [...dropdown.querySelectorAll('li')];

        let valueArray = dropdownArray.map(item => item.textContent);

        const closeDropdown = () => {
            dropdown.classList.remove('open');
        };

        inputField.addEventListener('input', () => {
            dropdown.classList.add('open');
            let inputValue = inputField.value.toLowerCase();
            dropdownArray.forEach((item, j) => {
                if (inputValue.length > 0) {
                    if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
                        item.classList.add('closed');
                    } else {
                        item.classList.remove('closed');
                    }
                } else {
                    item.classList.remove('closed');
                }
            });
        });

        dropdownArray.forEach(item => {
            item.addEventListener('click', () => {
                inputField.value = item.textContent;
                dropdownArray.forEach(dropdownItem => {
                    dropdownItem.classList.add('closed');
                });
                closeDropdown();
            });
        });

        inputField.addEventListener('focus', () => {
            dropdown.classList.add('open');
            dropdownArray.forEach(dropdownItem => {
                dropdownItem.classList.remove('closed');
            });
        });

        document.addEventListener('click', (evt) => {
            const isDropdown = dropdown.contains(evt.target);
            const isInput = inputField.contains(evt.target);
            if (!isDropdown && !isInput) {
                closeDropdown();
            }
        });
    });
}
