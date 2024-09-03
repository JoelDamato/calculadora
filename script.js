document.addEventListener('DOMContentLoaded', function () {
    const screen = document.getElementById('screen');
    let currentNumber = '';
    let firstOperand = null;
    let operator = null;
    let shouldResetScreen = false;

    function updateScreen(value) {
        if (shouldResetScreen) {
            screen.innerText = value;
            shouldResetScreen = false;
        } else {
            screen.innerText += value;
        }
    }

    function clearScreen() {
        screen.innerText = '0';
        currentNumber = '';
        firstOperand = null;
        operator = null;
        shouldResetScreen = false;
    }

    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', function () {
            if (screen.innerText === '0' || shouldResetScreen) {
                screen.innerText = '';
                shouldResetScreen = false;
            }
            currentNumber += button.value;
            updateScreen(button.value);
        });
    });

    document.querySelector('.decimal').addEventListener('click', function () {
        if (!currentNumber.includes('.')) {
            currentNumber += '.';
            updateScreen('.');
        }
    });

    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', function () {
            if (operator !== null && currentNumber !== '') {
                firstOperand = calculate(firstOperand, parseFloat(currentNumber), operator);
                screen.innerText = firstOperand;
            } else {
                firstOperand = parseFloat(currentNumber);
            }
            operator = button.value;
            currentNumber = '';
            shouldResetScreen = false;
            updateScreen(` ${button.value} `);
        });
    });

    document.getElementById('equal').addEventListener('click', function () {
        if (operator && currentNumber !== '') {
            let result = calculate(firstOperand, parseFloat(currentNumber), operator);
            result = parseFloat(result.toFixed(12)); // Limitar a 12 decimales
            screen.innerText = result;
            currentNumber = result.toString();
            operator = null;
            firstOperand = null;
            shouldResetScreen = true;
        }
    });

    document.getElementById('clear').addEventListener('click', clearScreen);

    function calculate(num1, num2, op) {
        switch (op) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                return num1 / num2;
            case '%':
                return (num1 * num2) / 100; // Calcular el porcentaje
            default:
                return num2;
        }
    }

    clearScreen();
});
