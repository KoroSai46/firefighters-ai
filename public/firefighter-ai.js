const panels = document.querySelectorAll('.panel');
let currentlyDragged = null;

let timeAccelerationInput = document.getElementById('timeAcceleration');
let fireChanceInput = document.getElementById('fireChance');

if (timeAccelerationInput) {
    timeAccelerationInput.value = defaultParameters.timeAcceleration ?? 1;
}

if (fireChanceInput) {
    fireChanceInput.value = defaultParameters.fireChance ?? 0.05;
}

panels.forEach(function (panel) {
    const drag = panel.querySelector('.drag');

    drag.addEventListener('mousedown', function (e) {
        currentlyDragged = panel;
        const offsetX = e.clientX - panel.getBoundingClientRect().left;
        const offsetY = e.clientY - panel.getBoundingClientRect().top;

        function movePanel(event) {
            panel.style.left = event.clientX - offsetX + 'px';
            panel.style.top = event.clientY - offsetY + 'px';
        }

        document.addEventListener('mousemove', movePanel);

        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', movePanel);
            currentlyDragged = null;
            panel.style.zIndex = '';
        });
    });
});

document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});




if (typeof socket !== 'undefined') {
    document.querySelectorAll('#parameters-panel input[data-property]').forEach(function (input) {
        input.addEventListener('input', function () {
            const property = input.getAttribute('data-property');
            const value = input.value;

            socket.emit('parameter:update', {property, value});
        });
    });

    socket.on('parameter:update', function (parameter) {
        document.querySelector(`#parameters-panel input[data-property="${parameter.property}"]`).value = parameter.value;
    });
}

class ToastManager {
    static error(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #ff416c, #ff4b2b)',
        }).showToast();
    }

    static success(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();
    }

    static info(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #4b6cb7, #182848)',
        }).showToast();
    }
}