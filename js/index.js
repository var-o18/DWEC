const URL = "../ws/";
let cacheDatos = [];

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('tablaElementos')) {
        traerElementos();
        document.getElementById('filtro').addEventListener('input', filtrarElementos);
    }
    const form = document.getElementById('registroForm');
    if (form) configurarFormulario(form);
});

function configurarFormulario(form) {
    document.getElementById('formLegend').innerHTML = "Nuevo Elemento";
    form.onsubmit = (e) => {
        e.preventDefault();
        insertarElemento(new FormData(form));
    };
}

function insertarElemento(formData) {
    Swal.fire({ title: 'Vas a crear un elemento nuevo chavalin', showCancelButton: true })
        .then((result) => {
            if (result.isConfirmed) {
                fetch(URL + "createElement2.php", { method: 'POST', body: formData })
                    .then(res => res.json())
                    .then(json => {
                        if (json.id) {
                            Swal.fire('Elemento creado', )
                                .then(() => window.location.href = "table.html");
                        }
                    });
            }
        });
}

function traerElementos() {
    fetch(URL + "getElement.php")
        .then(response => response.json())
        .then(json => {
            cacheDatos = json;
            llenarTabla(cacheDatos);
        })
        .catch(error => console.error("Error al cargar:", error));
}


function quitarAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarElementos() {
    const valor = document.getElementById('filtro').value.toLowerCase();

    if (valor.length < 3) {
        llenarTabla(cacheDatos);
        return;
    }

    const filtrados = cacheDatos.filter(item => {
        const nombre = quitarAcentos(item.nombre.toLowerCase());
        const descripcion = quitarAcentos(item.descripcion.toLowerCase());
        return nombre.includes(valor) || descripcion.includes(valor);
    });

    llenarTabla(filtrados);
}


function crearCelda(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

function crearFila(item) {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;

    let estBusca = (item.estado || "").toLowerCase();
    let estadoTexto = "Desconocido";
    if (estBusca === 'operativo' || estBusca === 'h' || estBusca === 'activo') estadoTexto = 'Activo';
    else if (estBusca === 'baja' || estBusca === 'o' || estBusca === 'inactivo') estadoTexto = 'Inactivo';
    else if (estBusca === 'mantenimiento' || estBusca === 'm') estadoTexto = 'Mantenimiento';


    let prioBusca = (item.prioridad || "").toString().toLowerCase();
    let prioridadTexto = "Baja";
    if (prioBusca === '1' || prioBusca === 'baja') prioridadTexto = "Baja";
    else if (prioBusca === '2' || prioBusca === 'media') prioridadTexto = "Media";
    else if (prioBusca === '3' || prioBusca === 'alta') prioridadTexto = "Alta";

    tr.appendChild(crearCelda(item.nombre || "Sin Nombre"));
    tr.appendChild(crearCelda(item.descripcion || ""));
    tr.appendChild(crearCelda(item.nserie || ""));
    tr.appendChild(crearCelda(estadoTexto));
    tr.appendChild(crearCelda(prioridadTexto));

    const tdAcciones = document.createElement('td');

    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Borrar';
    btnBorrar.onclick = () => eliminarElemento(item.id);
    tdAcciones.appendChild(btnBorrar);

    const btnModificar = document.createElement('button');
    btnModificar.textContent = 'Modificar';
    btnModificar.onclick = () => {
        console.log("Editando item:", item);
        prepararModificacion(item);
    };
    tdAcciones.appendChild(btnModificar);

    tr.appendChild(tdAcciones);

    return tr;
}

function prepararModificacion(item) {
    fetch('elementoedit.html')
        .then(respuesta => respuesta.text())
        .then(htmlDeArchivo => {

            Swal.fire({
                title: 'Editar Elemento',
                html: htmlDeArchivo,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                didOpen: () => {
                    document.getElementById('edit-nombre').value = item.nombre || "";
                    document.getElementById('edit-descripcion').value = item.descripcion || "";
                    document.getElementById('edit-nserie').value = item.nserie || "";

                    if (item.estado == 'h' || item.estado == 'activo' || item.estado == 'operativo') {
                        document.getElementById('edit-estado').value = 'Operativo';
                    } else if (item.estado == 'o' || item.estado == 'inactivo' || item.estado == 'baja') {
                        document.getElementById('edit-estado').value = 'Baja';
                    } else {
                        document.getElementById('edit-estado').value = 'Mantenimiento';
                    }

                    if (item.prioridad == '1' || item.prioridad == 'baja' || item.prioridad == 'Baja') {
                        document.getElementById('edit-prioridad').value = '1';
                    } else if (item.prioridad == '2' || item.prioridad == 'media' || item.prioridad == 'Media') {
                        document.getElementById('edit-prioridad').value = '2';
                    } else {
                        document.getElementById('edit-prioridad').value = '3';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const formElement = document.getElementById('form-edit-elemento');
                    const datosParaEnviar = new FormData(formElement);

                    confirmarModificacion(item.id, datosParaEnviar);
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar elementoedit.html:", error);
            Swal.fire('No se ha podido modificar el elemento', 'error');
        });
}

function confirmarModificacion(id, formData) {

    fetch(URL + "modifyElements.php?id=" + id, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(json => {
            console.log("Respuesta del servidor:", json);
            if (json.id) {
                Swal.fire('Elemento modificado correctamente', 'success')
                    .then(() => {
                        traerElementos();
                    });
            } else {
                Swal.fire('No se ha podido modificar el elemento', 'error');
            }
        })
        .catch(error => {
            console.error("Error al modificar:", error);
            Swal.fire('No se ha podido modificar el elemento', 'error');
        });
}

function eliminarElemento(id) {
    Swal.fire({
        title: 'Vas a borrar un elemento XD', icon: 'warning', showCancelButton: true, cancelButtonText: 'noooo', confirmButtonText: 'si, borrarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(URL + "deleteElement.php?id=" + id)
                .then(response => response.json())
                .then(json => {
                    if (json.id) {
                        Swal.fire('El elemento ha sido eliminado.', 'success');
                        traerElementos();
                    } else {
                        Swal.fire('No se ha podido eliminar el elemento', 'error');
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                    Swal.fire('No se ha podido eliminar el elemento', 'error');
                });
        }
    });
}

function llenarTabla(lista) {
    const table = document.getElementById('tablaElementos');
    if (!table) return;

    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    for (let i = 0; i < lista.length; i++) {
        const fila = crearFila(lista[i]);
        tbody.appendChild(fila);
    }
}

