let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
const editUserId = sessionStorage.getItem('editUserId');

function cargarDatosEdicion() {
    if (!editUserId) return;

    const legend = document.getElementById('formLegend');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const passwordField = document.getElementById('passwordField');

    legend.textContent = "Modificar Usuario";
    submitBtn.textContent = "Guardar Cambios";
    cancelBtn.style.display = "inline-block";
    if (passwordField) passwordField.style.display = "none";

    const user = usuarios.find(u => u.id == editUserId);
    if (user) {
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('apellidos').value = user.apellidos;
        document.getElementById('telefono').value = user.telefono;
        document.getElementById('email').value = user.email;

        const radio = document.querySelector(`input[name="sexo"][value="${user.sexo}"]`);
        if (radio) radio.checked = true;
    }
}

function guardarUsuario(e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        sexo: document.querySelector('input[name="sexo"]:checked').value
    };

    if (editUserId) {
        const index = usuarios.findIndex(u => u.id == editUserId);
        if (index !== -1) {
            usuarios[index] = { ...usuarios[index], ...formData };
        }
    } else {
        const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        usuarios.push({ id: newId, ...formData });
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    sessionStorage.removeItem('editUserId');
    window.location.href = "table.html";
}


function cancelar() {
    sessionStorage.removeItem('editUserId');
    window.location.href = "table.html";
}
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosEdicion();

    const form = document.getElementById('registroForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (form) form.addEventListener('submit', guardarUsuario);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelar);
});
