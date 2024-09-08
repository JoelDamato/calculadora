document.addEventListener('DOMContentLoaded', function () {
    const screen = document.getElementById('screen');
    const historyElement = document.getElementById('history');
    const modal = document.getElementById('history-modal');
    const closeModal = document.querySelector('.close');
    const openHistoryBtn = document.getElementById('open-history');
    let currentExpression = '';
    let shouldResetScreen = false;

    // Cargar historial del LocalStorage
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    let currentHistoryIndex = 0; // Índice actual de la paginación del historial

    // Función para actualizar la pantalla
    function updateScreen(value) {
        if (shouldResetScreen) {
            screen.innerText = value;
            shouldResetScreen = false;
        } else {
            screen.innerText = currentExpression;
        }
    }

    // Función para limpiar la pantalla
    function clearScreen() {
        screen.innerText = '';
        currentExpression = '';
        shouldResetScreen = false;
    }

    // Función para eliminar el último carácter
    function deleteLastCharacter() {
        currentExpression = currentExpression.slice(0, -1);
        screen.innerText = currentExpression || '0';
    }

    // Guardar historial en LocalStorage
    function saveHistory() {
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }

    // Agregar cálculo al historial y guardar en LocalStorage
    function addToHistory(operation, result) {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        const entry = {
            date: date,
            time: time,
            calculation: `${operation} = ${result}` // Mostrar la operación y el resultado
        };
        history.push(entry);
        saveHistory();
        updateHistoryDisplay(); // Actualizar la visualización del historial
    }

    // Función para mostrar los últimos 8 cálculos y permitir ver más
    function updateHistoryDisplay() {
        const maxDisplay = 8; // Mostrar solo 8 cálculos a la vez
        historyElement.innerHTML = ''; // Limpiar historial

        const totalEntries = history.length;
        const entriesToShow = history.slice(-currentHistoryIndex - maxDisplay, totalEntries - currentHistoryIndex).reverse();

        entriesToShow.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.textContent = `Día: ${entry.date} Hora: ${entry.time}, Cálculo: ${entry.calculation}`;
            historyItem.classList.add('history-item'); // Añadir clase para el borde
            historyElement.appendChild(historyItem);
        });

        // Si hay más cálculos, agregar el botón de "Ver anteriores"
        if (currentHistoryIndex + maxDisplay < totalEntries) {
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.textContent = 'Ver anteriores';
            viewMoreBtn.classList.add('view-more');
            viewMoreBtn.addEventListener('click', function () {
                currentHistoryIndex += maxDisplay; // Incrementar el índice para mostrar más cálculos
                updateHistoryDisplay(); // Actualizar visualización del historial
            });
            historyElement.appendChild(viewMoreBtn);
        }
    }

    // Reemplazar porcentajes en la expresión
    function replacePercentage(expression) {
        return expression.replace(/(\d+)\s*\*\s*(\d+)%/g, (match, base, percentage) => {
            return `(${base} * ${percentage} * 0.01)`;
        });
    }

    // Inicializar historial cuando se carga la página
    updateHistoryDisplay();

    // Manejo de los botones numéricos
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', function () {
            currentExpression += button.value;
            updateScreen(button.value);
        });
    });

    // Manejo del botón decimal
    document.querySelector('.decimal').addEventListener('click', function () {
        if (!currentExpression.includes('.')) {
            currentExpression += '.';
            updateScreen('.');
        }
    });

    // Manejo de los operadores
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', function () {
            if (shouldResetScreen) {
                shouldResetScreen = false;
            }
            currentExpression += button.value;
            updateScreen(button.value);
        });
    });

    // Manejo del botón igual
    document.getElementById('equal').addEventListener('click', function () {
        try {
            const expressionWithPercentage = replacePercentage(currentExpression);
            const result = eval(expressionWithPercentage);
            screen.innerText = parseFloat(result.toFixed(12)); // Limitar a 12 decimales
            addToHistory(currentExpression, result);
            currentExpression = result.toString();
            shouldResetScreen = true;
        } catch (e) {
            screen.innerText = 'Error';
            currentExpression = '';
        }
    });

    // Manejo del botón de limpiar pantalla
    document.getElementById('clear').addEventListener('click', clearScreen);

    // Manejo del botón de eliminar último carácter
    document.getElementById('delete').addEventListener('click', deleteLastCharacter);

    // Manejo de entrada del teclado
    document.addEventListener('keydown', function (e) {
        if (!isNaN(e.key)) {
            currentExpression += e.key;
            updateScreen(e.key);
        } else if (e.key === '.') {
            if (!currentExpression.includes('.')) {
                currentExpression += '.';
                updateScreen('.');
            }
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            currentExpression += e.key;
            updateScreen(e.key);
        } else if (e.key === 'Enter') {
            try {
                const expressionWithPercentage = replacePercentage(currentExpression);
                const result = eval(expressionWithPercentage);
                screen.innerText = parseFloat(result.toFixed(12)); // Limitar a 12 decimales
                addToHistory(currentExpression, result);
                currentExpression = result.toString();
                shouldResetScreen = true;
            } catch (e) {
                screen.innerText = 'Error';
                currentExpression = '';
            }
        } else if (e.key === 'Backspace') {
            deleteLastCharacter();
        }
    });

    // Mostrar historial modal
    openHistoryBtn.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    // Cerrar modal
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Cerrar modal si se hace clic fuera de la ventana modal
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    clearScreen();
});
