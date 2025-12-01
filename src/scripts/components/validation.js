const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\-\s]+$/;

const isInputValid = (input) => {
    if (input.validity.valueMissing || input.value === "") {
        return false;
    }

    if (input.dataset.errorMessage) {
        if (
            !NAME_REGEX.test(input.value) ||
            input.value.length < 2 ||
            input.value.length > 30 ||
            input.value === ""
        ) {
            return false;
        }
    }

    return input.validity.valid;
};

export const showInputError = (form, input, errorMessage, settings) => {
    let errorElement = form.querySelector(`#${input.id}-error`);

    if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.id = `${input.id}-error`;
        errorElement.classList.add("popup__error");
        input.parentNode?.appendChild(errorElement) ||
            form.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
    input.classList.add(settings.inputErrorClass);
    errorElement.classList.add(settings.errorClass);
};

export const hideInputError = (form, input, settings) => {
    const errorElement = form.querySelector(`#${input.id}-error`);

    if (!errorElement) return;

    errorElement.textContent = "";
    input.classList.remove(settings.inputErrorClass);
    errorElement.classList.remove(settings.errorClass);
};

export const checkInputValidity = (form, input, settings) => {
    const isValid = isInputValid(input);

    if (!isValid) {
        let errorMessage = input.validationMessage;

        if (
            input.dataset.errorMessage &&
            (!NAME_REGEX.test(input.value) ||
                input.value.length < 2 ||
                input.value.length > 30 ||
                input.value === "")
        ) {
            errorMessage = input.dataset.errorMessage;
        }

        showInputError(form, input, errorMessage, settings);
        return false;
    }

    hideInputError(form, input, settings);
    return true;
};

export const hasInvalidInput = (form, settings) => {
    const inputs = form.querySelectorAll(settings.inputSelector);

    return Array.from(inputs).some((input) => !isInputValid(input));
};

export const disableSubmitButton = (button, settings) => {
    button.classList.add(settings.inactiveButtonClass);
    button.disabled = true;
};

export const enableSubmitButton = (button, settings) => {
    button.classList.remove(settings.inactiveButtonClass);
    button.disabled = false;
};

export const toggleButtonState = (form, button, settings) => {
    if (hasInvalidInput(form, settings)) {
        disableSubmitButton(button, settings);
    } else {
        enableSubmitButton(button, settings);
    }
};

export const setEventListeners = (form, settings) => {
    const inputs = form.querySelectorAll(settings.inputSelector);
    const submitButton = form.querySelector(settings.submitButtonSelector);

    toggleButtonState(form, submitButton, settings);

    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            checkInputValidity(form, input, settings);
            toggleButtonState(form, submitButton, settings);
        });
    });

    form.addEventListener("submit", (evt) => {
        evt.preventDefault();
    });
};

export const clearValidation = (form, settings) => {
    const inputs = form.querySelectorAll(settings.inputSelector);
    const submitButton = form.querySelector(settings.submitButtonSelector);

    inputs.forEach((input) => {
        hideInputError(form, input, settings);
    });

    disableSubmitButton(submitButton, settings);
};

export const enableValidation = (settings) => {
    document.querySelectorAll(settings.formSelector).forEach((form) => {
        setEventListeners(form, settings);
    });
};
