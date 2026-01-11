const initialUsers = [
  { id: 1, nombre: "Pepe", apellidos: "Pérez", telefono: "600123123", email: "pepe@example.com", sexo: "masculino" },
  { id: 2, nombre: "Ana", apellidos: "López", telefono: "600456456", email: "ana@example.com", sexo: "femenino" },
  { id: 3, nombre: "Mario", apellidos: "García", telefono: "611777888", email: "mario@example.com", sexo: "masculino" },
  { id: 4, nombre: "Lucía", apellidos: "Pérez", telefono: "612000001", email: "lucia@example.com", sexo: "femenino" },
  { id: 5, nombre: "Carlos", apellidos: "López", telefono: "612000002", email: "carlos@example.com", sexo: "masculino" },
  { id: 6, nombre: "Sofía", apellidos: "García", telefono: "612000003", email: "sofia@example.com", sexo: "femenino" },
  { id: 7, nombre: "Juan", apellidos: "Martínez", telefono: "612000004", email: "juan@example.com", sexo: "masculino" },
  { id: 8, nombre: "Laura", apellidos: "Martínez", telefono: "612000005", email: "laura@example.com", sexo: "femenino" },
  { id: 9, nombre: "Pedro", apellidos: "Pérez", telefono: "612000006", email: "pedro@example.com", sexo: "masculino" },
  { id: 10, nombre: "María", apellidos: "López", telefono: "612000007", email: "maria@example.com", sexo: "femenino" },
];

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || initialUsers;

const cuerpoTabla = document.querySelector('#tablaUsuarios tbody');
const inputFiltro = document.querySelector('#filtro');

function saveToLocalStorage() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function crearCelda(texto, editable = false, tipo = 'text') {
  const td = document.createElement('td');
  if (editable) {
    const input = document.createElement('input');
    input.type = tipo;
    input.value = texto;
    input.className = 'edit-input';
    td.appendChild(input);
  } else {
    td.textContent = texto;
  }
  return td;
}

function crearCeldaSelect(valor, editable = false) {
  const td = document.createElement('td');
  if (editable) {
    const select = document.createElement('select');
    select.className = 'edit-input';
    const opciones = [
      { value: 'masculino', text: 'H' },
      { value: 'femenino', text: 'M' },
      { value: 'otro', text: 'O' }
    ];
    opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op.value;
      option.textContent = op.text;
      if (op.value === valor) option.selected = true;
      select.appendChild(option);
    });
    td.appendChild(select);
  } else {
    td.textContent = valor === 'masculino' ? 'H' : (valor === 'femenino' ? 'M' : 'O');
  }
  return td;
}

function crearFila(usuario, modoEdicion = false) {
  const tr = document.createElement('tr');
  tr.dataset.userId = usuario.id;

  if (modoEdicion) {
    tr.appendChild(crearCelda(usuario.nombre, true));
    tr.appendChild(crearCelda(usuario.apellidos, true));
    tr.appendChild(crearCelda(usuario.email, true, 'email'));
    tr.appendChild(crearCeldaSelect(usuario.sexo, true));
    tr.appendChild(crearCelda(usuario.telefono, true, 'tel'));

    const celdaAccion = document.createElement('td');
    
    const botonGuardar = document.createElement('button');
    botonGuardar.textContent = 'Guardar';
    botonGuardar.style.backgroundColor = '#4CAF50';
    botonGuardar.style.color = 'white';
    botonGuardar.onclick = () => guardarEdicionInline(usuario.id, tr);
    celdaAccion.appendChild(botonGuardar);

    const botonCancelar = document.createElement('button');
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.style.backgroundColor = '#f44336';
    botonCancelar.style.color = 'white';
    botonCancelar.onclick = () => cancelarEdicionInline();
    celdaAccion.appendChild(botonCancelar);

    tr.appendChild(celdaAccion);
  } else {
    tr.appendChild(crearCelda(usuario.nombre));
    tr.appendChild(crearCelda(usuario.apellidos));
    tr.appendChild(crearCelda(usuario.email));
    tr.appendChild(crearCeldaSelect(usuario.sexo));
    tr.appendChild(crearCelda(usuario.telefono));

    const celdaAccion = document.createElement('td');

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Borrar Elemento';
    botonEliminar.onclick = () => eliminarUsuarioPorId(usuario.id);
    celdaAccion.appendChild(botonEliminar);

    const botonModificar = document.createElement('button');
    botonModificar.textContent = 'Modificar Elemento';
    botonModificar.onclick = () => editarUsuarioInline(usuario.id);
    celdaAccion.appendChild(botonModificar);

    tr.appendChild(celdaAccion);
  }

  return tr;
}

function editarUsuarioInline(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) return;

  const tr = document.querySelector(`tr[data-user-id="${usuarioId}"]`);
  if (!tr) return;

  const nuevaFila = crearFila(usuario, true);
  tr.parentNode.replaceChild(nuevaFila, tr);
}

function guardarEdicionInline(usuarioId, tr) {
  const inputs = tr.querySelectorAll('.edit-input');
  if (inputs.length < 5) return;

  const usuarioActualizado = {
    nombre: inputs[0].value.trim(),
    apellidos: inputs[1].value.trim(),
    email: inputs[2].value.trim(),
    sexo: inputs[3].value,
    telefono: inputs[4].value.trim()
  };

  const index = usuarios.findIndex(u => u.id === usuarioId);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...usuarioActualizado };
    saveToLocalStorage();
    
    const nuevaFila = crearFila(usuarios[index], false);
    tr.parentNode.replaceChild(nuevaFila, tr);
    
    const filtro = inputFiltro.value;
    if (filtro.length >= 3) {
      filtrarUsuarios();
    }
  }
}

function cancelarEdicionInline() {
  llenarTabla(inputFiltro.value.length >= 3 ? 
    usuarios.filter(u => {
      const filtro = quitarAcentos(inputFiltro.value.toLowerCase());
      const nombre = quitarAcentos(u.nombre.toLowerCase());
      const apellidos = quitarAcentos(u.apellidos.toLowerCase());
      return nombre.includes(filtro) || apellidos.includes(filtro);
    }) : usuarios
  );
}

function llenarTabla(lista) {
  if (!cuerpoTabla) return;
  cuerpoTabla.innerHTML = '';
  for (const usuario of lista) {
    const fila = crearFila(usuario);
    cuerpoTabla.appendChild(fila);
  }
}

function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarUsuarios() {
  const filtro = quitarAcentos(inputFiltro.value.toLowerCase());
  if (filtro.length < 3) {
    llenarTabla(usuarios);
    return;
  }
  const usuariosFiltrados = usuarios.filter(u => {
    const nombre = quitarAcentos(u.nombre.toLowerCase());
    const apellidos = quitarAcentos(u.apellidos.toLowerCase());
    return nombre.includes(filtro) || apellidos.includes(filtro);
  });

  llenarTabla(usuariosFiltrados);
}

function eliminarUsuarioPorId(id) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios.splice(index, 1);
    saveToLocalStorage();
    
    const filtro = inputFiltro.value;
    if (filtro.length >= 3) {
      filtrarUsuarios();
    } else {
      llenarTabla(usuarios);
    }
  }
}

window.onload = () => {
  if (localStorage.getItem('usuarios') === null) {
    saveToLocalStorage();
  }
  llenarTabla(usuarios);
  if (inputFiltro) {
    inputFiltro.addEventListener('input', filtrarUsuarios);
  }
};