
document.addEventListener('DOMContentLoaded', () => {

    // elementos
    const characterLinks = document.querySelectorAll('.character-link');
    const input = document.querySelector('.entrada-principal');
    const loadingSpinner = document.getElementById('loading-spinner');
    const emptyState = document.getElementById('empty-state')
    const letra = document.querySelector('#profile-name')
    const no_encontrado = document.querySelector('.no_encontrado')
    const borrado = document.querySelector('.borrado')

    const avatar = document.querySelector('.avatar-placeholder')

    function toggleEmptyState(show) {
        if (show) {
            emptyState.style.display = 'flex';
            document.querySelector('.info-grid').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            document.querySelector('.info-grid').style.display = 'block';
        }
    }

    characterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            characterLinks.forEach(l => l.classList.remove('active'));
            
            this.classList.add('active');

            const spanSeleccionado = this.querySelector('.character-name');
            console.log('Botón clicado: ', spanSeleccionado.innerText);

            const valor_seleccionado = document.querySelector('.valor_seleccionado')
            let texto = valor_seleccionado.innerText.trim()

            let ruta = ''
            let nombre = ''

            if (texto === 'Characters') {
                ruta = 'personaje'
                nombre = 'name'

            } else if (texto === 'Species') {
                ruta = 'especies'
                nombre = 'nombre'

            } else if (texto === 'Starships') {
                ruta = 'naves'
                nombre = 'nave'

            } else if (texto === 'Planets') {
                ruta = 'planets'
                nombre = 'planeta'

            } else if (texto === 'Movies') {
                ruta = 'pelicula'
                nombre = 'titulo'
            }

            fetch(`/api/${ruta}/?${nombre}=${encodeURIComponent(spanSeleccionado.innerText)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        mostrarResultadoEnHTML(data, '.info-content');
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.innerText = spanSeleccionado.innerText
                        avatar.innerText = spanSeleccionado.innerText[0]
                    })
                    .catch(error => {
                        console.error('Error al obtener datos del personaje:', error);
                    });
        });
    })

    function mostrarResultadoEnHTML(data, contenedorId) {
        const contenedor = document.querySelector('.info-content');

        if (!contenedor) {
            console.error(`Error: No se encontró el contenedor con ID ${contenedorId}.`);
            return;
        }

        contenedor.innerHTML = ''; 

        if (data.error || !data.datos) { 
            let mensaje = document.createElement('p')
            mensaje.textContent = `Error al cargar los datos: ${data.message || 'Error desconocido'}`
            contenedor.appendChild(mensaje)
            return;
        }

        for (const clave in data.datos) {
            let encabezadoDiv = document.createElement('div');
            encabezadoDiv.className = 'info-item'; 

            let textoClave = document.createElement('span');
            textoClave.className = 'item-label'
            textoClave.innerText = `${clave}`;
            textoClave.style.color = '#e6eaf1'

            let textovalor = document.createElement('span');
            textovalor.className = 'item-value'
            textovalor.innerText = `${data.datos[clave]}`;
            textovalor.style.color = '#e6eaf1'

            encabezadoDiv.appendChild(textoClave)
            encabezadoDiv.appendChild(textovalor)

            contenedor.appendChild(encabezadoDiv)
            
        }

        /*if (data.premisa) {
            const info = document.querySelector('.info-card')
            let pre = document.createElement('div');
            pre.className = 'premisa'; 

            let dato_aparte = document.createElement('h3')
            dato_aparte.innerText = data.premisa

            pre.appendChild(dato_aparte)
            info.appendChild(pre)
            
        }*/

        scroll.scrollTop = contenedor.scroll;
    }

    function setupPersonajesForm() {
        const formulario = document.querySelector('#formulario-personaje'); 
        const profile = document.querySelector('.profile-name')
        const question = document.querySelector('.avatar-placeholder')

        if (formulario && input) {
            formulario.addEventListener('submit', function(event) {
                event.preventDefault();
                loadingSpinner.style.display = 'block';

                const valorBusqueda = input.value.trim();
                if (!valorBusqueda) {
                    profile.innerText = 'Please enter a name';
                    question.className = 'avatar-placeholder-error'
                    question.innerText = 'X'

                    loadingSpinner.style.display = 'none'
                    return;
                }

                fetch(`/api/personaje/?name=${encodeURIComponent(valorBusqueda)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);

                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Datos de personaje recibidos:', data);
                        mostrarResultadoEnHTML(data, '.info-content');
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.remove()

                        avatar.remove()
                    })
                    .catch(error => {
                        no_encontrado.innerText = 'this character does not exist';
                        borrado.innerText = ''
                        loadingSpinner.style.display = 'none'
                        console.error('Error al obtener datos del personaje:', error);

                    });
            });
        } else {
            console.log('Formulario de Personajes no encontrado en esta página. Omite inicialización.');
        }
    }

    function setupPeliculasForm() {
        const formulario = document.querySelector('#formulario-pelicula'); 

        if (formulario && input) {
            formulario.addEventListener('submit', function(event) {
                event.preventDefault();

                const valorBusqueda = input.value.trim();
                if (!valorBusqueda) {
                    let mensaje = document.createElement('p')
                    mensaje.innerText = 'Por favor, ingrese un título de película.'
                    contenedor.appendChild(mensaje)
                    return;
                }

                fetch(`/api/pelicula/?titulo=${encodeURIComponent(valorBusqueda)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Datos de película recibidos:', data);
                        mostrarResultadoEnHTML(data, '.info-content');
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.textContent = data.datos.nombre
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de la película:', error);
                        no_encontrado.innerText = 'this movie does not exist';
                        borrado.innerText = ''
                        loadingSpinner.style.display = 'none'
                    });
            });
        } else {
            console.log('Formulario de Películas no encontrado en esta página. Omite inicialización.');
        }
    }

    function setupPlanetas () {
        const formulario = document.querySelector('#formulario-planeta')

        if (formulario && input) {
            formulario.addEventListener('submit', function(e) {
                e.preventDefault()

                let ent = input.value.trim()
                console.log(ent)

                if (!ent){
                    mensaje_error = document.createElement('p')
                    mensaje_error.innerText = 'No ha ingresado ningun planeta'
                    contenido.appendChild(mensaje_error)
                    return
                }
                fetch(`/api/planets/?planeta=${encodeURIComponent(ent)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Datos de película recibidos:', data);
                        mostrarResultadoEnHTML(data, '.info-content')
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.textContent = data.datos.nombre
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de la película:', error);
                        no_encontrado.innerText = 'this planet does not exist';
                        borrado.innerText = ''
                        loadingSpinner.style.display = 'none'
                    })
                
            })
        } else {
            console.log('Formulario de Planetas no encontrado en esta página. Omite inicialización.');
        }
    }

    function setupNaves () {
        const formulario = document.querySelector('#formulario-naves')

        if (formulario && input) {
            formulario.addEventListener('submit', function(e) {
                e.preventDefault()

                let ent = input.value.trim()
                console.log(ent)

                if (!entrada){
                    mensaje_error = document.createElement('p')
                    mensaje_error.innerText = 'No ha ingresado ningun planeta'
                    contenido.appendChild(mensaje_error)
                    return
                }
                fetch(`/api/naves/?nave=${encodeURIComponent(ent)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Datos de naves recibidos:', data);
                        mostrarResultadoEnHTML(data, '#resultado-nave')
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.textContent = data.datos.nombre
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de la nave:', error);
                        no_encontrado.innerText = 'this starships does not exist';
                        borrado.innerText = ''
                        loadingSpinner.style.display = 'none'
                    })
                
            })
        } else {
            console.log('Formulario de Naves no encontrado en esta página. Omite inicialización.');
        }
    }

    function setupEspecies () {
        const formulario = document.querySelector('#formulario-especie')

        if (formulario && input) {
            formulario.addEventListener('submit', function(e) {
                e.preventDefault()

                let ent = input.value.trim()
                console.log(ent)

                if (!entrada){
                    mensaje_error = document.createElement('p')
                    mensaje_error.innerText = 'No ha ingresado ninguna especie'
                    contenido.appendChild(mensaje_error)
                    return
                }
                fetch(`/api/especies/?nombre=${encodeURIComponent(ent)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Datos de naves recibidos:', data);
                        mostrarResultadoEnHTML(data, '#resultado-especie')
                        loadingSpinner.style.display = 'none'
                        toggleEmptyState(false);

                        letra.textContent = data.datos.nombre
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de la nave:', error);
                        no_encontrado.innerText = 'this specie does not exist';
                        borrado.innerText = ''
                        loadingSpinner.style.display = 'none'
                    })
            })
        } else {
            console.log('Formulario de Naves no encontrado en esta página. Omite inicialización.');
        }
    }
    setupPersonajesForm();
    setupPeliculasForm();
    setupPlanetas()
    setupNaves()
    setupEspecies()

    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });

    toggleEmptyState(true);
});


