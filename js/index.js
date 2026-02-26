const URL = "../ws/";
let cacheDatos = [];

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('tablaElementos')) {
        traerUsuarios();
        document.getElementById('filtro').addEventListener('input', filtrarUsuarios);
    }
    const formulario = document.getElementById('registroForm');
    if (formulario) configurarFormulario(formulario);
});

function configurarFormulario(formulario) {
    document.getElementById('formLegend').innerHTML = "nuevo usuario";
    formulario.onsubmit = (e) => {
        e.preventDefault();
        insertarUsuario(new FormData(formulario));
    };
}

function insertarUsuario(datosFormulario) {
    Swal.fire({ title: 'vas a crear un usuario nuevo chavalin', showCancelButton: true })
        .then((resultado) => {
            if (resultado.isConfirmed) {
                fetch(URL + "crearUsuario2.php", { method: 'POST', body: datosFormulario })
                    .then(respuesta => respuesta.json())
                    .then(datosJson => {
                        if (datosJson.success) {
                            Swal.fire('usuario creado maquinaaaaa', )
                                .then(() => window.location.href = "table.html");
                        } else {
                            Swal.fire('vaya fallo', datosJson.message, 'error');
                        }
                    });
            }
        });
}

function traerUsuarios() {
    fetch(URL + "getUsuario.php")
        .then(respuesta => respuesta.json())
        .then(datosJson => {
            if (datosJson.success) {
                cacheDatos = datosJson.data;
                llenarTabla(cacheDatos);
            }
        })
        .catch(error => console.error("error al cargar:", error));
}

function quitarAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarUsuarios() {
    const valorBusqueda = document.getElementById('filtro').value.toLowerCase();

    if (valorBusqueda.length < 3) {
        llenarTabla(cacheDatos);
        return;
    }

    const usuariosFiltrados = cacheDatos.filter(usuario => {
        const nombreUsuario = quitarAcentos((usuario.nombre || "").toLowerCase());
        const apellidosUsuario = quitarAcentos((usuario.apellidos || "").toLowerCase());
        return nombreUsuario.includes(valorBusqueda) || apellidosUsuario.includes(valorBusqueda);
    });

    llenarTabla(usuariosFiltrados);
}

function crearCelda(contenidoTexto) {
    const celda = document.createElement('td');
    celda.textContent = contenidoTexto;
    return celda;
}

function crearFila(usuarioIndividual) {
    const filaTabla = document.createElement('tr');
    filaTabla.dataset.id = usuarioIndividual.id;

    filaTabla.appendChild(crearCelda(usuarioIndividual.nombre || "sin nombre"));
    filaTabla.appendChild(crearCelda(usuarioIndividual.apellidos || ""));
    filaTabla.appendChild(crearCelda(usuarioIndividual.email || ""));
    filaTabla.appendChild(crearCelda(usuarioIndividual.telefono || ""));
    filaTabla.appendChild(crearCelda(usuarioIndividual.sexo || ""));
    filaTabla.appendChild(crearCelda(usuarioIndividual.fecha_nacimiento || ""));

    const celdaAcciones = document.createElement('td');

    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = 'borrar';
    botonBorrar.onclick = () => eliminarUsuario(usuarioIndividual.id);
    celdaAcciones.appendChild(botonBorrar);

    const botonModificar = document.createElement('button');
    botonModificar.textContent = 'modificar';
    botonModificar.onclick = () => {
        console.log("editando usuario:", usuarioIndividual);
        prepararModificacion(usuarioIndividual);
    };
    celdaAcciones.appendChild(botonModificar);

    filaTabla.appendChild(celdaAcciones);

    return filaTabla;
}

function prepararModificacion(usuario) {
    fetch('elementoedit.html')
        .then(respuestaServidor => respuestaServidor.text())
        .then(codigoHtml => {
            Swal.fire({
                title: 'editar usuario maquina',
                html: codigoHtml,
                showCancelButton: true,
                confirmButtonText: 'guardar cambios',
                didOpen: () => {
                    document.getElementById('edit-nombre').value = usuario.nombre || "";
                    document.getElementById('edit-apellidos').value = usuario.apellidos || "";
                    document.getElementById('edit-email').value = usuario.email || "";
                    document.getElementById('edit-telefono').value = usuario.telefono || "";
                    document.getElementById('edit-sexo').value = usuario.sexo || "H";
                    document.getElementById('edit-fecha').value = usuario.fecha_nacimiento || "";
                }
            }).then((resultadoSwal) => {
                if (resultadoSwal.isConfirmed) {
                    const elementoFormulario = document.getElementById('form-edit-usuario');
                    const datosAEnviar = new FormData(elementoFormulario);
                    confirmarModificacion(usuario.id, datosAEnviar);
                }
            });
        })
        .catch(errorCarga => {
            console.error("error al cargar elementoedit.html:", errorCarga);
            Swal.fire('no se ha podido modificar el usuario', 'error');
        });
}

function confirmarModificacion(idUsuario, datosPost) {
    fetch(URL + "modificarUsuario.php?id=" + idUsuario, {
        method: 'POST',
        body: datosPost
    })
        .then(respuestaServidor => {
            if (!respuestaServidor.ok) throw new Error('error en la respuesta del servidor');
            return respuestaServidor.json();
        })
        .then(datosJson => {
            console.log("respuesta del servidor:", datosJson);
            if (datosJson.success) {
                Swal.fire('usuario modificado correctamente maquinaaaaa', 'success')
                    .then(() => {
                        traerUsuarios();
                    });
            } else {
                Swal.fire('no se ha podido modificar el usuario', 'error');
            }
        })
        .catch(errorPeticion => {
            console.error("error al modificar:", errorPeticion);
            Swal.fire('no se ha podido modificar el usuario', 'error');
        });
}

function eliminarUsuario(idParaBorrar) {
    Swal.fire({
        title: 'vas a borrar un usuario XD', icon: 'warning', showCancelButton: true, cancelButtonText: 'noooo', confirmButtonText: 'si, borrarlo'
    }).then((resultadoBorrado) => {
        if (resultadoBorrado.isConfirmed) {
            fetch(URL + "deleteUsuario.php?id=" + idParaBorrar)
                .then(respuestaServidor => respuestaServidor.json())
                .then(datosJson => {
                    if (datosJson.success) {
                        Swal.fire('el usuario ha sido eliminado maquinaaaaa', 'success');
                        traerUsuarios();
                    } else {
                        Swal.fire('no se ha podido eliminar el usuario', 'error');
                    }
                })
                .catch(errorBorrado => {
                    console.error("error al eliminar:", errorBorrado);
                    Swal.fire('no se ha podido eliminar el usuario', 'error');
                });
        }
    });
}

function llenarTabla(listaUsuarios) {
    const tablaAlumnos = document.getElementById('tablaElementos');
    if (!tablaAlumnos) return;

    const cuerpoTabla = tablaAlumnos.getElementsByTagName('tbody')[0];
    cuerpoTabla.innerHTML = '';

    for (let i = 0; i < listaUsuarios.length; i++) {
        const filaNueva = crearFila(listaUsuarios[i]);
        cuerpoTabla.appendChild(filaNueva);
    }
}
