const panels = document.querySelectorAll('.panel');
let currentlyDragged = null;

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


document.querySelectorAll('#parameters-panel input[data-property]').forEach(function (input) {
    input.addEventListener('input', function () {
        const property = input.getAttribute('data-property');
        const value = input.value;

        socket.emit('parameter:update', {property, value});
    });
});