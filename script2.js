const modalContenedor = document.getElementById('modalContenedor'); // Modal con formulario
document.getElementById('formCdMain').addEventListener('submit', guardarCiudadMain); // Formulario
document.getElementById('btnBorrarCdMain').addEventListener('click',deleteCiudadMain); //Boton para borrar la ciudad main
document.getElementById('btnBorrarTodo').addEventListener('click',deleteAll);

// Elementos del banner
let h1NombreCdMain = document.getElementById('cdMainNombre');
let h2CentigradosCdMain = document.getElementById('cdMainCentigrados');
let h2AmbienteCdMain = document.getElementById('cdMainAmbiente');

// Elementos de la Card Clima en otras ciudades
document.getElementById('formCiudades').addEventListener('submit', guardarNuevaCiudad);

let arrCiudades = ['New York', 'Phoenix', 'Obregon', 'Mexico City', 'Monterrey'];

// Acciones localStorage para Ciudad Main ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getCiudadMain() {
    return localStorage.getItem('cdMain'); 
}

function saveCiudadMain(nombre) {
    localStorage.setItem('cdMain', nombre);
    console.log(`La ciudad ${nombre} fue guardada exitosamente`);
    setCiudadMain();
}

function deleteCiudadMain() {
    localStorage.removeItem('cdMain');
    console.log('Se borró la ciudad principal');

    h1NombreCdMain.innerHTML = `<span class="placeholder col-6"></span>`;
    h2CentigradosCdMain.innerHTML = `<span class="placeholder col-1"></span>`;
    h2AmbienteCdMain.innerHTML = `<span class="placeholder col-2"></span>`;

    setCiudadMain();
}

function deleteAll(){
    localStorage.clear();
    location.reload();
}


// Acciones localStorage para Ciudades predeterminadas
function getCiudades() {
    return JSON.parse(localStorage.getItem('ciudades'));
}

function saveCiudades(arrCiudades) {
    arrCiudades.sort((a, b) => a.localeCompare(b));  // Asegurar que siempre estén ordenadas
    localStorage.setItem('ciudades', JSON.stringify(arrCiudades));
}

//-------------------------------------------------------- Funciones asincrónicas para Ciudad Main ----------------------------------------------------------------------------------------------------------------

async function setCiudadMain() {
    const ciudadMain = getCiudadMain();

    if (ciudadMain === null) {
        modalContenedor.classList.add('show');
    } else {
        const nombreCdMain = ciudadMain; 
        const dataCiudad = await dataCiudades(nombreCdMain);

        if (dataCiudad == null) {
            alert(`Ocurrió un problema al obtener los datos de la ciudad ${nombreCdMain}`);
        } else {
            setCiudadMainHtml(dataCiudad);  // Usar los datos ya procesados
        }
    }
}

async function guardarCiudadMain(e) {
    e.preventDefault();
    const nombreCdMain = document.getElementById('nombreCiudadMain').value.toLowerCase();

    // Verificación de que el nombre existe
    const dataCiudad = await dataCiudades(nombreCdMain);

    if (dataCiudad === null) {
        alert(`La ciudad ${nombreCdMain} no se ha encontrado.`);
        document.getElementById('formCdMain').reset();
    } else {
        saveCiudadMain(dataCiudad.nombre);  // Usar el nombre ya procesado
        modalContenedor.classList.remove('show');
    }
}

function setCiudadMainHtml(dataCiudad) {
    h1NombreCdMain.innerHTML = `Clima en: <strong>${dataCiudad.nombre}</strong>`;
    h2CentigradosCdMain.innerHTML = `${dataCiudad.temperatura}°C`;
    h2AmbienteCdMain.innerHTML = `${dataCiudad.ambiente}`;
}

//-------------------------------------------------------- Funciones asincrónicas para Ciudades predeterminadas -----------------------------------------------

async function guardarNuevaCiudad(e) {
    e.preventDefault();
    const nombreCiudad = document.getElementById('nombreCiudad').value.toLowerCase();
    arrCiudades = getCiudades() || [];

    if (arrCiudades.includes(nombreCiudad)) {
        alert(`Los datos de la ciudad ${nombreCiudad} ya se están mostrando en pantalla.`);
    } else {
        const dataCiudad = await dataCiudades(nombreCiudad);
        if (dataCiudad == null) {
            alert(`La ciudad ${nombreCiudad} no se ha encontrado.`);
            document.getElementById('formCiudades').reset();
        } else {
            arrCiudades.push(dataCiudad.nombre);  // Agregar el nombre procesado al array
            arrCiudades.sort((a, b) => a.localeCompare(b));  // Ordenar alfabéticamente
            saveCiudades(arrCiudades);  // Invocar el método para guardar el nuevo arreglo de ciudades
            alert('Datos agregados exitosamente');
            document.getElementById('formCiudades').reset();
            getCiudadesData();  // Actualizar la vista de ciudades
        }
    }
}

async function getCiudadesData() {
    arrCiudades = getCiudades() || [];
    arrCiudades.sort((a, b) => a.localeCompare(b));  // Ordenar alfabéticamente
    let arrDataCiudades = [];

    for (let i = 0; i < arrCiudades.length; i++) {
        const datos = await dataCiudades(arrCiudades[i]);

        if (datos == null) {
            alert(`Ocurrió un problema al obtener los datos de ${arrCiudades[i]}`);
        } else {
            arrDataCiudades.push(datos);  // Almacenar datos procesados en el array
        }
    }
    setCiudades(arrDataCiudades);
}

function setCiudades(arrDataCiudades) {
    let contCiudades = document.getElementById('contCiudades');
    contCiudades.innerHTML = '';
    
    arrDataCiudades.forEach(dataCiudad => {
        contCiudades.innerHTML += `
            <div class="row border-bottom d-flex justify-content-between align-items-end fs-5 mb-2">
                <div class="col-4">${dataCiudad.nombre}</div> <!-- Ciudad Nombre -->
                <div class="col-3">${dataCiudad.temperatura}°C</div> <!-- Ciudad Temperatura -->
                <div class="col-3">${dataCiudad.ambiente}</div>
                <div class="col-2 d-flex justify-content-end container-fluid" id="imgIco">
                    <img class="img-ico-ciudades" src="img/icons/${dataCiudad.icono}"> <!-- Ciudad icono ambiente -->
                </div> 
            </div>
        `;
    });

    setHornyCity(arrDataCiudades);
}

function setHornyCity(arrDataCiudades) {
    let contCiudadHot = document.getElementById('contCiudadHot');
    contCiudadHot.innerHTML = '';

    let temperaturas = arrDataCiudades.map(ciudad => ciudad.temperatura);
    let tempAlta = Math.max(...temperaturas);
    let i = arrDataCiudades.findIndex(ciudad => ciudad.temperatura == tempAlta);
    console.log(`Temperatura alta indice ${i}`);

    contCiudadHot.innerHTML += `
        <div class="row border-bottom d-flex justify-content-between align-items-end fs-5 container-fluid">
            <div class="col-5">${arrDataCiudades[i].nombre}</div> <!-- Ciudad Nombre -->
            <div class="col-3">${arrDataCiudades[i].temperatura}°C</div> <!-- Ciudad Temperatura -->
            <div class="col-3 d-flex justify-content-end">
                <img class="img-ico" src="img/icons/${arrDataCiudades[i].icono}">
            </div> <!-- Ciudad icono -->
        </div>
    `;
}

// Fetch para obtener la data de la ciudad
async function dataCiudades(nombre) {
    const apiKey = '3788a8440f77fa6322c25c894dadfc09';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${nombre}&appid=${apiKey}`;
    
    try {
        const res = await fetch(apiURL);

        if (res.ok) {
            const data = await res.json();
            const nombre = data.name;
            const temperatura = (data.main.temp - 273.15).toFixed(2);
            const icono = data.weather[0].icon + '.png';
            const ambiente = getAmbiente(icono);

            return { //Enviar objeto ya procesado directamente a la variable que invoque el metodo 
                nombre: nombre,
                temperatura: temperatura,
                icono: icono,
                ambiente: ambiente
            }; 
        } else {
            console.log(`No se encontró la ciudad ${nombre}`);
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Función para obtener el ambiente
function getAmbiente(png) {
    let ambiente;
    switch (png) {
        case '01d.png':
        case '01n.png':
            ambiente = "Despejado";
            break;
        case '02d.png':
        case '02n.png':
            ambiente = "Algunas nubes";
            break;
        case '03d.png':
        case '03n.png':
            ambiente = "Nublado";
            break;
        case '04d.png':
        case '04n.png':
            ambiente = "Muy nublado";
            break;
        case '09d.png':
        case '09n.png':
            ambiente = "Llovizna";
            break;
        case '10d.png':
        case '10n.png':
            ambiente = "Lloviendo";
            break;
        case '11d.png':
        case '11n.png':
            ambiente = "Tormenta";
            break;
        case '13d.png':
        case '13n.png':
            ambiente = "Nevando";
            break;
        case '50d.png':
        case '50n.png':
            ambiente = "Neblina";
            break;
        default:
            ambiente = "";
            break;
    }
    return ambiente;
}

//localStorage.clear();

setCiudadMain();

if (!localStorage.getItem('ciudades')) {
    console.log("Agregar ciudades predeterminadas a local storage");
    saveCiudades(arrCiudades);  
} else {
    console.log("Se encontraron ciudades en localStorage.");
}

//console.log(localStorage.getItem('ciudades'));

// deleteCiudadMain();

console.log(getCiudades());
getCiudadesData();
