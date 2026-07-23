const display = document.getElementById('display');
const historyDisplay = document.getElementById('history-display');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let history = '';
let operator = null;
let previousValue = null;
let resetDisplay = false;

// Bengali numerals mapping
const banglaNumerals = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.' // decimal point remains same
};

const englishNumerals = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
    '.': '.'
};

function convertToBangla(str) {
    return String(str).split('').map(char => banglaNumerals[char] || char).join('');
}

function convertToEnglish(str) {
    return String(str).split('').map(char => englishNumerals[char] || char).join('');
}

function updateDisplay() {
    display.value = convertToBangla(currentInput);
    historyDisplay.textContent = convertToBangla(history);
}

function appendNumber(number) {
    if (resetDisplay) {
        currentInput = convertToEnglish(number.toString());
        resetDisplay = false;
    } else if (currentInput === '0' || currentInput === '-0') {
        currentInput = convertToEnglish(number.toString());
    } else {
        currentInput += convertToEnglish(number.toString());
    }
    updateDisplay();
}

function appendDecimal() {
    if (resetDisplay) {
        currentInput = '0.';
        resetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (previousValue === null) {
        previousValue = parseFloat(currentInput);
    } else if (operator) {
        const result = calculate(previousValue, parseFloat(currentInput), operator);
        currentInput = result.toString();
        previousValue = result;
    }
    operator = nextOperator;
    history = convertToBangla(previousValue + ' ' + nextOperator);
    resetDisplay = true;
    updateDisplay();
}

function calculate(prev, current, op) {
    switch (op) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            return current !== 0 ? prev / current : 'Error';
        default:
            return current;
    }
}

function evaluate() {
    if (operator === null || resetDisplay) return;
    if (currentInput === '') return; // Prevent calculating if current input is empty

    const currentValue = parseFloat(currentInput);
    const result = calculate(previousValue, currentValue, operator);

    history = convertToBangla(previousValue + ' ' + operator + ' ' + currentValue + ' =');

    currentInput = result.toString();
    operator = null;
    previousValue = null;
    resetDisplay = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    history = '';
    operator = null;
    previousValue = null;
    resetDisplay = false;
    updateDisplay();
}

function backspace() {
    if (resetDisplay) return; // Don't backspace if a new number is expected

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

buttons.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        const value = e.target.textContent;
        const action = e.target.dataset.action;
        const isNumber = e.target.classList.contains('number');
        const isOperator = e.target.classList.contains('operator');
        const isDecimal = e.target.classList.contains('decimal');

        if (isNumber) {
            appendNumber(value);
        } else if (isDecimal) {
            appendDecimal();
        } else if (isOperator) {
            chooseOperator(e.target.dataset.value);
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'backspace') {
            backspace();
        } else if (action === 'calculate') {
            evaluate();
        }
    }
});

// Initial display
updateDisplay();