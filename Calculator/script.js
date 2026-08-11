const previousDisplay =
    document.getElementById("previous");

const currentDisplay =
    document.getElementById("current");



let currentNumber = "0";

let previousNumber = "";

let operation = null;

let resetScreen = false;


function updateDisplay() {

    currentDisplay.innerText =
        currentNumber;

    previousDisplay.innerText =
        previousNumber +
        (operation ? " " + operation : "");

}



function appendNumber(number) {

    if (resetScreen) {

        currentNumber = "0";

        resetScreen = false;

    }



    if (
        number === "." &&
        currentNumber.includes(".")
    ) {
        return;
    }



    if (
        currentNumber === "0" &&
        number !== "."
    ) {

        currentNumber = number;

    } else {

        currentNumber += number;

    }


    updateDisplay();
}



function chooseOperation(op) {

    if (currentNumber === "") {
        return;
    }


    if (previousNumber !== "") {

        calculate();

    }


    operation = op;

    previousNumber = currentNumber;

    resetScreen = true;

    updateDisplay();
}



function calculate() {

    if (
        previousNumber === "" ||
        operation === null
    ) {
        return;
    }


    const previous =
        parseFloat(previousNumber);

    const current =
        parseFloat(currentNumber);


    let result;


    switch (operation) {

        case "+":
            result = previous + current;
            break;


        case "-":
            result = previous - current;
            break;


        case "*":
            result = previous * current;
            break;


        case "/":

            if (current === 0) {

                currentNumber = "Error";

                previousNumber = "";

                operation = null;

                updateDisplay();

                resetScreen = true;

                return;

            }

            result = previous / current;

            break;
    }



    result =
        Math.round(result * 100000000) /
        100000000;


    currentNumber =
        result.toString();

    previousNumber = "";

    operation = null;

    resetScreen = true;

    updateDisplay();
}



function clearCalculator() {

    currentNumber = "0";

    previousNumber = "";

    operation = null;

    resetScreen = false;

    updateDisplay();
}


function deleteNumber() {

    if (currentNumber === "Error") {

        clearCalculator();

        return;

    }


    if (currentNumber.length === 1) {

        currentNumber = "0";

    } else {

        currentNumber =
            currentNumber.slice(0, -1);

    }


    updateDisplay();
}



function percentage() {

    currentNumber =
        (parseFloat(currentNumber) / 100)
        .toString();

    updateDisplay();
}



const numberButtons =
    document.querySelectorAll(
        "[data-number]"
    );


numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(
            button.dataset.number
        );

    });

});


const operationButtons =
    document.querySelectorAll(
        "[data-operation]"
    );


operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(
            button.dataset.operation
        );

    });

});


const actionButtons =
    document.querySelectorAll(
        "[data-action]"
    );


actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action =
            button.dataset.action;


        if (action === "clear") {

            clearCalculator();

        }


        if (action === "delete") {

            deleteNumber();

        }


        if (action === "percent") {

            percentage();

        }


        if (action === "calculate") {

            calculate();

        }

    });

});



document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        appendNumber(key);

    }


    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        chooseOperation(key);

    }



    if (
        key === "Enter" ||
        key === "="
    ) {

        calculate();

    }



    if (key === "Backspace") {

        deleteNumber();

    }



    if (key === "Escape") {

        clearCalculator();

    }



    if (key === "%") {

        percentage();

    }

});