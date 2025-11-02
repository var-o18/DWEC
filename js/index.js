const usuarios = [
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
  { id: 11, nombre: "Raúl", apellidos: "Ruiz", telefono: "612000008", email: "raul@example.com", sexo: "masculino" },
  { id: 12, nombre: "Carmen", apellidos: "Ruiz", telefono: "612000009", email: "carmen@example.com", sexo: "femenino" },
  { id: 13, nombre: "José", apellidos: "García", telefono: "612000010", email: "jose@example.com", sexo: "masculino" },
  { id: 14, nombre: "Elena", apellidos: "Pérez", telefono: "612000011", email: "elena@example.com", sexo: "femenino" },
  { id: 15, nombre: "Manuel", apellidos: "López", telefono: "612000012", email: "manuel@example.com", sexo: "masculino" },
  { id: 16, nombre: "Isabel", apellidos: "Martínez", telefono: "612000013", email: "isabel@example.com", sexo: "femenino" },
  { id: 17, nombre: "Alberto", apellidos: "García", telefono: "612000014", email: "alberto@example.com", sexo: "masculino" },
  { id: 18, nombre: "Paula", apellidos: "Pérez", telefono: "612000015", email: "paula@example.com", sexo: "femenino" },
  { id: 19, nombre: "Rubén", apellidos: "Ruiz", telefono: "612000016", email: "ruben@example.com", sexo: "masculino" },
  { id: 20, nombre: "Cristina", apellidos: "García", telefono: "612000017", email: "cristina@example.com", sexo: "femenino" },
  { id: 21, nombre: "Miguel", apellidos: "López", telefono: "612000018", email: "miguel@example.com", sexo: "masculino" },
  { id: 22, nombre: "Natalia", apellidos: "Ruiz", telefono: "612000019", email: "natalia@example.com", sexo: "femenino" },
  { id: 23, nombre: "Sergio", apellidos: "Martínez", telefono: "612000020", email: "sergio@example.com", sexo: "masculino" },
  { id: 24, nombre: "Andrea", apellidos: "García", telefono: "612000021", email: "andrea@example.com", sexo: "femenino" },
  { id: 25, nombre: "David", apellidos: "López", telefono: "612000022", email: "david@example.com", sexo: "masculino" },
  { id: 26, nombre: "Marta", apellidos: "Pérez", telefono: "612000023", email: "marta@example.com", sexo: "femenino" },
  { id: 27, nombre: "Iván", apellidos: "Ruiz", telefono: "612000024", email: "ivan@example.com", sexo: "masculino" },
  { id: 28, nombre: "Patricia", apellidos: "Martínez", telefono: "612000025", email: "patricia@example.com", sexo: "femenino" },
  { id: 29, nombre: "Javier", apellidos: "Pérez", telefono: "612000026", email: "javier@example.com", sexo: "masculino" },
  { id: 30, nombre: "Rosa", apellidos: "García", telefono: "612000027", email: "rosa@example.com", sexo: "femenino" },
  { id: 31, nombre: "Tomás", apellidos: "López", telefono: "612000028", email: "tomas@example.com", sexo: "masculino" },
  { id: 32, nombre: "Clara", apellidos: "Ruiz", telefono: "612000029", email: "clara@example.com", sexo: "femenino" },
  { id: 33, nombre: "Andrés", apellidos: "Martínez", telefono: "612000030", email: "andres@example.com", sexo: "masculino" },
];

const cuerpoTabla = document.querySelector('#tablaUsuarios tbody');
const inputFiltro = document.querySelector('#filtro');

function crearCelda(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function crearFila(usuario) {
  const tr = document.createElement('tr');

  tr.appendChild(crearCelda(usuario.nombre));
  tr.appendChild(crearCelda(usuario.apellidos));
  tr.appendChild(crearCelda(usuario.telefono));
  tr.appendChild(crearCelda(usuario.email));
  tr.appendChild(crearCelda(usuario.sexo));

  const celdaAccion = document.createElement('td');
  const botonEliminar = document.createElement('button');

  botonEliminar.textContent = 'X';
  botonEliminar.style.backgroundColor = 'red';
  botonEliminar.style.color = 'white';
  botonEliminar.onclick = () => eliminarUsuarioPorId(usuario.id);

  celdaAccion.appendChild(botonEliminar);
  tr.appendChild(celdaAccion);
  
  return tr;
}



function llenarTabla(lista) {
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
    const coincideTexto = nombre.includes(filtro) || apellidos.includes(filtro);
    return coincideTexto;
  });

  llenarTabla(usuariosFiltrados);
}



function eliminarUsuarioPorId(id) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios.splice(index, 1);
    llenarTabla(usuarios);
  }
}




window.onload = () => {
  llenarTabla(usuarios);
  inputFiltro.addEventListener('input', filtrarUsuarios);
};