// Alterna sidebar en móviles
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Resalta sección activa
function setActive(element) {
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => link.classList.remove('active'));
    element.classList.add('active');
    const targetId = element.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    document.querySelectorAll('.card, .card-perfiles').forEach(card => card.classList.remove('highlight'));
    targetSection.classList.add('highlight');
    targetSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('sidebar').classList.remove('open');
}

// Cerrar sesión
function logout() {
    alert("Acabas de cerrar sesión como administrador");
    window.location.href = 'loginAdmin.html';
}

// Muestra formulario según tipo
function mostrarFormulario(tipo) {
    var formContainer = document.getElementById("formularioUsuario");
    if (tipo === 'admin') {
        formContainer.innerHTML = `
          <h2 class="form-title">Crear un nuevo Administrador</h2>
          <div class="campos">
              <div class="campo">
                  <label>Nombres y Apellidos</label>
                  <input type="text" id="adminNombre" placeholder="Ingresa información" required>
              </div>
              <div class="campo">
                  <label>Correo</label>
                  <input type="email" id="adminCorreo" placeholder="Ingresa información" required>
              </div>
              <div class="campo">
                  <label>Contraseña</label>
                  <input type="text" id="adminContraseña" placeholder="Ingresa la contraseña" required>
              </div>
          </div>
          <div class="botones">
              <button class="btn-crear" onclick="crearAdministrador()">Crear Administrador</button>
              <button class="btn-regresar" onclick="ocultarFormulario()">Regresar</button>
          </div>
      `;
    } else {
        formContainer.innerHTML = `
          <h2 class="form-title">Crear un nuevo Usuario</h2>
          <div class="campos">
              <div class="campo">
                  <label>Nombres y Apellidos</label>
                  <input type="text" id="nombre" placeholder="Ingresa información" required>
              </div>
              <div class="campo">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" id="fechaNacimiento" placeholder="Ingresa fecha de nacimiento" required>
              </div>
              <div class="campo">
                  <label>Correo</label>
                  <input type="email" id="correo" placeholder="Ingresa información" required>
              </div>
              <div class="campo">
                  <label>Teléfono</label>
                  <input type="tel" id="telefono" placeholder="Ingresa información" required maxlength="9">
              </div>
          </div>
          <div class="botones">
              <button class="btn-crear" onclick="crearUsuario()">Crear Usuario</button>
              <button class="btn-regresar" onclick="ocultarFormulario()">Regresar</button>
          </div>
      `;
    }
    formContainer.style.display = "block";
}

// Oculta formulario y limpia contenido
function ocultarFormulario() {
    const formContainer = document.getElementById("formularioUsuario");
    formContainer.style.display = "none";
    formContainer.innerHTML = "";
}

// Crea usuario (se envía a /crearUsuario)
function crearUsuario() {
    const nombre = document.getElementById("nombre").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !fechaNacimiento || !correo || !telefono) {
        alert("Por favor, rellene todos los campos.");
        return;
    }

    fetch("http://localhost:3000/crearUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, fecha_nacimiento: fechaNacimiento, correo, telefono })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? data.message : "Error: " + data.message);
            ocultarFormulario();
        })
        .catch(error => {
            console.error("Error en la creación del usuario:", error);
            alert("Error al conectar con el servidor.");
        });
}

// Crea administrador (se envía a /crearAdmin)
function crearAdministrador() {
    const nombre = document.getElementById("adminNombre").value.trim();
    const correo = document.getElementById("adminCorreo").value.trim();
    const contraseña = document.getElementById("adminContraseña").value.trim();

    if (!nombre || !correo || !contraseña) {
        alert("Por favor, rellene todos los campos.");
        return;
    }

    fetch("http://localhost:3000/crearAdmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, correo, contraseña })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.success ? data.message : "Error: " + data.message);
            ocultarFormulario();
        })
        .catch(error => {
            console.error("Error en la creación del administrador:", error);
            alert("Error al conectar con el servidor.");
        });
}

// Función para ver la tabla de usuarios de la base de datos
function verTablaUsuarios() {
    fetch("http://localhost:3000/usuarios")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let html = '<table>';
                html += '<thead><tr>';
                if (data.usuarios.length > 0) {
                    Object.keys(data.usuarios[0]).forEach(columna => {
                        html += `<th>${columna}</th>`;
                    });
                    html += '</tr></thead>';
                    html += '<tbody>';
                    data.usuarios.forEach(usuario => {
                        html += '<tr>';
                        Object.values(usuario).forEach(valor => {
                            if (valor instanceof Date || (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/))) {
                                html += `<td>${new Date(valor).toISOString().split('T')[0]}</td>`;
                            } else {
                                html += `<td>${valor}</td>`;
                            }
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                } else {
                    html = "<p>No hay usuarios registrados.</p>";
                }
                document.getElementById("tablaUsuarios").innerHTML = html;
                document.getElementById("tablaUsuarios").style.display = "block";
                document.getElementById("tablaAdministradores").style.display = "none";
            } else {
                document.getElementById("tablaUsuarios").innerHTML = `<p>Error: ${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error("Error al obtener la tabla de usuarios:", error);
            document.getElementById("tablaUsuarios").innerHTML = `<p>Error al conectar con el servidor.</p>`;
        });
}

// Función para ver la tabla de administradores
function verTablaAdmin() {
    fetch("http://localhost:3000/administradores")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let html = '<table>';
                html += '<thead><tr>';
                if (data.administradores.length > 0) {
                    Object.keys(data.administradores[0]).forEach(columna => {
                        html += `<th>${columna}</th>`;
                    });
                    html += '</tr></thead>';
                    html += '<tbody>';
                    data.administradores.forEach(admin => {
                        html += '<tr>';
                        Object.values(admin).forEach(valor => {
                            html += `<td>${valor}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                } else {
                    html = "<p>No hay administradores registrados.</p>";
                }
                document.getElementById("tablaAdministradores").innerHTML = html;
                document.getElementById("tablaAdministradores").style.display = "block";
                document.getElementById("tablaUsuarios").style.display = "none";
            } else {
                document.getElementById("tablaAdministradores").innerHTML = `<p>Error: ${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error("Error al obtener la tabla de administradores:", error);
            document.getElementById("tablaAdministradores").innerHTML = `<p>Error al conectar con el servidor.</p>`;
        });
}

/******************** CAMBIO DE CREDENCIALES EN USUARIO DASHBOARD ************************/

function cambioUsuarios() {
    document.getElementById("divUsuario").style.display = "block";
    document.getElementById("divAdmin").style.display = "none";
}

function cerrarDivUsuario() {
    document.getElementById("divUsuario").style.display = "none";
}

// Función para buscar usuario
async function buscarUsuario() {
    const userId = document.getElementById("userId").value;
    try {
        const response = await fetch(`/usuario/${userId}`);
        const data = await response.json();
        if (data.success) {
            document.getElementById("nombreUsuario").value = data.usuario.nombre;
            document.getElementById("fechaNacimientoUsuario").value = data.usuario.fecha_nacimiento.split('T')[0];
            document.getElementById("correoUsuario").value = data.usuario.correo;
            document.getElementById("telefonoUsuario").value = data.usuario.telefono;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al buscar usuario:', error);
        alert('Error al buscar usuario.');
    }
}

// Función para editar usuario
function editarUsuario() {
    document.getElementById("nombreUsuario").removeAttribute("readonly");
    document.getElementById("fechaNacimientoUsuario").removeAttribute("readonly");
    document.getElementById("correoUsuario").removeAttribute("readonly");
    document.getElementById("telefonoUsuario").removeAttribute("readonly");
}

// Función para actualizar usuario
async function actualizarUsuario() {
    const userId = document.getElementById("userId").value;
    const nombre = document.getElementById("nombreUsuario").value;
    const fechaNacimiento = document.getElementById("fechaNacimientoUsuario").value;
    const correo = document.getElementById("correoUsuario").value;
    const telefono = document.getElementById("telefonoUsuario").value;

    try {
        const response = await fetch(`/usuario/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                fecha_nacimiento: fechaNacimiento,
                correo,
                telefono
            })
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            document.getElementById("nombreUsuario").setAttribute("readonly", "readonly");
            document.getElementById("fechaNacimientoUsuario").setAttribute("readonly", "readonly");
            document.getElementById("correoUsuario").setAttribute("readonly", "readonly");
            document.getElementById("telefonoUsuario").setAttribute("readonly", "readonly");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        alert('Error al actualizar usuario.');
    }
}

async function borrarUsuario() {
    const userId = document.getElementById("userId").value;

    try {
        const response = await fetch(`/usuario/${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            document.getElementById("nombreUsuario").value = '';
            document.getElementById("correoUsuario").value = '';
            document.getElementById("telefonoUsuario").value = '';
            document.getElementById("userId").value = '';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al borrar usuario:', error);
        alert('Error al borrar usuario.');
    }
}

/***************** CAMBIO DE CREDENCIALES EN ADMINISTRADOR DASHBOARD ************************/

function cambioAdmin() {
    document.getElementById("divUsuario").style.display = "none";
    document.getElementById("divAdmin").style.display = "block";
}

// Función para buscar un administrador por ID
async function buscarAdmin() {
    const adminId = document.getElementById("adminId").value;
    try {
        const response = await fetch(`/admin/${adminId}`);
        const data = await response.json();
        if (data.success) {
            document.getElementById("nombreAdmin").value = data.admin.nombre;
            document.getElementById("correoAdmin").value = data.admin.correo;
            document.getElementById("contrasenaAdmin").value = data.admin.contrasena;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al buscar administrador:', error);
        alert('Error al buscar administrador.');
    }
}

function editarAdmin() {
    document.getElementById("nombreAdmin").removeAttribute("readonly");
    document.getElementById("correoAdmin").removeAttribute("readonly");
    document.getElementById("contrasenaAdmin").removeAttribute("readonly");
}

async function actualizarAdmin() {
    const adminId = document.getElementById("adminId").value;
    const nombre = document.getElementById("nombreAdmin").value;
    const correo = document.getElementById("correoAdmin").value;
    const contrasena = document.getElementById("contrasenaAdmin").value;

    try {
        const response = await fetch(`/admin/${adminId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, correo, contrasena })
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            document.getElementById("nombreAdmin").setAttribute("readonly", "readonly");
            document.getElementById("correoAdmin").setAttribute("readonly", "readonly");
            document.getElementById("contrasenaAdmin").setAttribute("readonly", "readonly");
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al actualizar administrador:', error);
        alert('Error al actualizar administrador.');
    }
}

async function borrarAdmin() {
    const adminId = document.getElementById("adminId").value;

    try {
        const response = await fetch(`/admin/${adminId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            document.getElementById("nombreAdmin").value = '';
            document.getElementById("correoAdmin").value = '';
            document.getElementById("contrasenaAdmin").value = '';
            document.getElementById("adminId").value = '';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('❌ Error al borrar administrador:', error);
        alert('Error al borrar administrador.');
    }
}

function cerrarDivAdmin() {
    document.getElementById("divAdmin").style.display = "none";
}

/******** FUNCION DE NOTIFICACIONES DE CAMPANITA ********/

document.addEventListener('DOMContentLoaded', function () {
    const bell = document.getElementById('notificationBell');
    const dropdown = document.getElementById('notificationDropdown');
    const notificationCounter = document.querySelector('.notification-counter');
    const notificationScroll = document.querySelector('.notification-scroll');

    let notifications = [];
    let unreadCount = 0;

    async function loadNotifications() {
        try {
            const adminName = localStorage.getItem('adminName') || 'Administrador';
            const response = await fetch(`/api/notifications?adminName=${encodeURIComponent(adminName)}`);

            if (!response.ok) throw new Error('Error al cargar notificaciones');

            notifications = await response.json();
            unreadCount = notifications.filter(n => !n.read).length;  // Cambiado para contar solo no leídas

            renderNotifications();
            updateCounter();
        } catch (error) {
            console.error('Error:', error);
            loadSampleNotifications();
        }
    }

    function renderNotifications() {
        notificationScroll.innerHTML = '';

        if (notifications.length === 0) {
            notificationScroll.innerHTML = `
                <div class="no-notifications">
                    No hay notificaciones nuevas
                </div>
            `;
            return;
        }

        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.type}-notification`;
            notificationItem.dataset.id = notification.id;

            notificationItem.innerHTML = `
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-time">${notification.time}</div>
                    <div class="notification-preview">${notification.message}</div>
                </div>
                <button class="delete-notification">
                    <img src="./img/cancelar.png" alt="Eliminar">
                </button>
            `;

            notificationScroll.appendChild(notificationItem);
        });

        document.querySelectorAll('.delete-notification').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                deleteNotification(this.closest('.notification-item'));
            });
        });
    }

    function updateCounter() {
        notificationCounter.textContent = unreadCount;
        notificationCounter.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    async function deleteNotification(element) {
        const id = element.dataset.id;
        try {
            const adminName = localStorage.getItem('adminName') || 'Administrador';
            await fetch(`/api/notifications/${id}?adminName=${encodeURIComponent(adminName)}`, {
                method: 'DELETE'
            });
            element.remove();
            unreadCount--;
            updateCounter();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function markAllAsRead() {
        try {
            const adminName = localStorage.getItem('adminName') || 'Administrador';
            await fetch(`/api/notifications/mark-all-read?adminName=${encodeURIComponent(adminName)}`, {
                method: 'POST'
            });
            unreadCount = 0;
            updateCounter();
            loadNotifications();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function loadSampleNotifications() {
        notifications = [];
        unreadCount = 0;
        renderNotifications();
        updateCounter();
    }

    bell.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', function () {
        dropdown.classList.remove('show');
    });

    document.querySelector('.mark-all-read')?.addEventListener('click', function (e) {
        e.preventDefault();
        markAllAsRead();
    });

    loadNotifications();
    setInterval(loadNotifications, 300000); // Actualizar cada 5 minutos
});

/********************* METRICAS DE RED WIFI ******************************/

// Función para mostrar el div de métricas
function visualizarMetricas() {
    document.getElementById("metricsDiv").style.display = "block";
}

// Función para ocultar el div de métricas y volver al estado original
function regresarMetricas() {
    document.getElementById("metricsDiv").style.display = "none";
}

// Para analizar si es 3G, 4G o 5G
function updateConnectionType() {
    const connectionTypeElement = document.getElementById('connectionType');
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const effectiveType = connection.effectiveType.toLowerCase();
        let formattedType;
        if (effectiveType === '3g') {
            formattedType = '3G';
        } else if (effectiveType === '4g') {
            formattedType = '4G';
        } else if (effectiveType === '5g') {
            formattedType = '5G';
        } else {
            formattedType = effectiveType.charAt(0).toUpperCase() + effectiveType.slice(1);
        }
        connectionTypeElement.textContent = formattedType;
        connection.addEventListener('change', () => {
            const newEffectiveType = connection.effectiveType.toLowerCase();
            if (newEffectiveType === '3g') {
                connectionTypeElement.textContent = '3G';
            } else if (newEffectiveType === '4g') {
                connectionTypeElement.textContent = '4G';
            } else if (newEffectiveType === '5g') {
                connectionTypeElement.textContent = '5G';
            } else {
                connectionTypeElement.textContent = newEffectiveType.charAt(0).toUpperCase() + newEffectiveType.slice(1);
            }
        });
    } else {
        connectionTypeElement.textContent = 'No disponible';
    }
}
updateConnectionType();

// Velocidad de descarga del WIFI
function calculateDownloadSpeed() {
    const imageUrl = 'http://localhost:3000/img/credencialesSeguras.webp'; // URL de tu imagen
    const xhr = new XMLHttpRequest();
    const startTime = new Date().getTime();

    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // tiempo en segundos
        const bitsLoaded = xhr.response.size * 8; // tamaño en bits
        const speedBps = bitsLoaded / duration; // velocidad en bits por segundo
        const speedMbps = speedBps / (1024 * 1024); // convertir a megabits por segundo

        document.getElementById('downloadSpeed').textContent = speedMbps.toFixed(2) + ' Mbps';
        document.getElementById('progressBar').style.width = '100%'; // Completar la barra de progreso
    };
    xhr.onerror = function () {
        console.error('Error al medir la velocidad de descarga');
        document.getElementById('downloadSpeed').textContent = 'Error al calcular';
    };
    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            document.getElementById('progressBar').style.width = percentComplete + '%'; // Actualizar la barra de progreso
        }
    };
    xhr.send();
}
calculateDownloadSpeed();

// Medir la latencia de la Red WIFI
function measureLatency() {
    const url = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    const startTime = new Date().getTime();

    fetch(url, { method: 'GET', mode: 'no-cors' })
        .then(response => {
            const endTime = new Date().getTime();
            const latency = endTime - startTime; // Latencia en milisegundos
            document.getElementById('latency').textContent = latency + ' ms';
            document.querySelector('.progress-bar').style.width = '100%'; // Completar la barra de progreso
        })
        .catch(error => {
            console.error('Error al medir la latencia:', error);
            document.getElementById('latency').textContent = 'Error';
        });
}

setInterval(measureLatency, 5000);
measureLatency();

// Obtener todos los dispositivos conectados en la Red WIFI
async function updateDeviceCount() {
    try {
        const response = await fetch('/api/devices');
        const data = await response.json();
        document.getElementById('devices').innerHTML = data.count + ' <span>conectados</span>';
    } catch (error) {
        console.error('Error al obtener el conteo:', error);
    }
}
updateDeviceCount();
setInterval(updateDeviceCount, 5000);

// Función para medir el ancho de banda
const ctx = document.getElementById('bandwidthChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Descarga (Mbps)',
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                data: []
            },
            {
                label: 'Subida (Mbps)',
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function actualizarGraficos() {
    fetch('/speed')
        .then(response => response.json())
        .then(data => {
            const now = new Date().toLocaleTimeString();
            chart.data.labels.push(now);
            chart.data.datasets[0].data.push(data.download);
            chart.data.datasets[1].data.push(data.upload);

            if (chart.data.labels.length > 10) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
                chart.data.datasets[1].data.shift();
            }

            chart.update();
        })
        .catch(error => console.error('Error:', error));
}

setInterval(actualizarGraficos, 3000);

// Para visualizar la estabilidad de la conexion

const ctxStability = document.getElementById('stabilityChart').getContext('2d');
const stabilityChart = new Chart(ctxStability, {
    type: 'radar',
    data: {
        labels: ['Latencia (ms)', 'Descarga (Mbps)', 'Subida (Mbps)'],
        datasets: [{
            label: 'Estabilidad de Red',
            data: [0, 0, 0],
            backgroundColor: 'rgba(0, 128, 255, 0.2)',
            borderColor: 'blue',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                min: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                    font: { size: 14 }
                },
                angleLines: { display: true },
                grid: { circular: true }
            }
        },
        plugins: {
            legend: { display: true, position: 'top' }
        }
    }
});

function actualizarDatos() {
    fetch('http://localhost:3000/api/stability')
        .then(response => response.json())
        .then(data => {
            stabilityChart.data.datasets[0].data = [data.latency, data.download, data.upload];
            stabilityChart.update();
        })
        .catch(error => console.error('❌ Error obteniendo datos:', error));
}

setInterval(actualizarDatos, 3000);

// Grafico de perdida de paquetes

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.querySelector("#networkChart");
    if (canvas instanceof HTMLCanvasElement) {
        const chartContext = canvas.getContext("2d");

        const packetLossChart = new Chart(chartContext, {
            type: "line",
            data: {
                labels: [], // Tiempo
                datasets: [
                    {
                        label: "Pérdida de Paquetes (%)",
                        data: [],
                        borderColor: "red",
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        title: { display: true, text: "Pérdida (%)" },
                    },
                    x: {
                        title: { display: true, text: "Tiempo" },
                    },
                },
            },
        });

        function actualizarPacketLoss() {
            fetch("http://localhost:3000/api/packetloss")
                .then((response) => response.json())
                .then((data) => {
                    const now = new Date().toLocaleTimeString();
                    if (packetLossChart.data.labels.length > 10) {
                        packetLossChart.data.labels.shift();
                        packetLossChart.data.datasets[0].data.shift();
                    }
                    packetLossChart.data.labels.push(now);
                    packetLossChart.data.datasets[0].data.push(data.loss);
                    packetLossChart.update();
                })
                .catch((error) => console.error("❌ Error obteniendo datos:", error));
        }

        setInterval(actualizarPacketLoss, 3000);
    } else {
        console.error('❌ No se encontró el elemento <canvas> con id "networkChart"');
    }
});

// Info card de estado de Red
async function loadNetworkInfo() {
    try {
        const networkResponse = await fetch('http://localhost:3000/network-info');
        const networkData = await networkResponse.json();
        const securityLevel = document.getElementById('securityLevel');
        const securityText = document.getElementById('securityText');
        const securityMessage = document.getElementById('securityMessage');

        securityText.textContent = `SSID: ${networkData.ssid}, Seguridad: ${networkData.security}`;

        if (networkData.secure) {
            securityLevel.className = 'security-level high';
            securityMessage.textContent = 'Conexión segura';
        } else {
            securityLevel.className = 'security-level low';
            securityMessage.textContent = 'Conexión insegura';
        }
    } catch (error) {
        console.error('Error al cargar la información de la red:', error);
    }
}

// Info card de seguridad de red

async function checkConnection() {
    try {
        const response = await fetch('http://localhost:3000/check-connection');
        const data = await response.json();
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        const statusMessage = document.getElementById('statusMessage');
        if (data.status === 'Conectado') {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Óptimo';
            statusMessage.textContent = 'La conexión es estable';
        } else if (data.status === 'Desconectado') {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Desconectado';
            statusMessage.textContent = 'Sin conexión a Internet';
        } else if (data.status === 'Inestable') {
            statusIndicator.className = 'status-indicator unstable';
            statusText.textContent = 'Internet Inestable';
            statusMessage.textContent = 'Conexión intermitente';
        }
    } catch (error) {
        console.error('Error al verificar la conexión:', error);
    }
}

// Info card para recomendar un canal
async function loadChannelRecommendation() {
    try {
        const response = await fetch('http://localhost:3000/channel-recommendation');
        const data = await response.json();
        const recommendation = document.getElementById('recommendation');
        recommendation.innerHTML = `Canal ${data.recommendedChannel} (5GHz)`;
    } catch (error) {
        console.error('Error al cargar la recomendación de canal:', error);
        document.getElementById('recommendation').innerHTML = 'Error al obtener recomendación';
    }
}

// Cargar la información al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM cargado");
    await Promise.all([
        checkConnection(),
        loadNetworkInfo(),
        loadChannelRecommendation()
    ]);
});

/**************** FUNCION DE BUSCAR DISPOSITIVOS DE LOS USUARIOS **************/

// Variables globales
let dispositivosActuales = [];

// Control de la UI
function toggleVista() {
    const listaPerfiles = document.querySelector('.perfil-lista');
    const contenedorDispositivos = document.querySelector('.contenedor-dispositivos');

    if (contenedorDispositivos.style.display === 'block') {
        contenedorDispositivos.style.display = 'none';
        listaPerfiles.style.display = 'block';
    } else {
        listaPerfiles.style.display = 'none';
        contenedorDispositivos.style.display = 'block';
        cargarDispositivos();
    }
}

// Carga de datos
async function cargarDispositivos() {
    try {
        const respuesta = await fetch('/api/dispositivosEncontrados');
        const { success, dispositivos, error } = await respuesta.json();

        if (!success) throw new Error(error || 'Error desconocido');

        dispositivosActuales = dispositivos;
        renderizarTabla(dispositivos);
        configurarBusqueda();

    } catch (error) {
        console.error('Error:', error);
        mostrarError(`Error al cargar dispositivos: ${error.message}`);
    }
}

// Renderizado de tabla
function renderizarTabla(dispositivos) {
    const tbody = document.getElementById('device-list');
    tbody.innerHTML = dispositivos.map(dispositivo => `
        <tr>
            <td>${dispositivo.nombre}</td>
            <td>${dispositivo.ip}</td>
            <td>${dispositivo.mac}</td>
            <td>
                <span class="estado ${dispositivo.estado}">
                    ${dispositivo.estado}
                    <i class="fas fa-${dispositivo.estado === 'conectado' ? 'check' : 'times'}"></i>
                </span>
            </td>
        </tr>
    `).join('');
}

// Búsqueda en tiempo real
function configurarBusqueda() {
    const buscar = () => {
        const texto = document.getElementById('search-bar').value.toLowerCase();
        const filas = document.querySelectorAll('#device-list tr');

        filas.forEach(fila => {
            const coincide = fila.textContent.toLowerCase().includes(texto);
            fila.style.display = coincide ? '' : 'none';
        });
    };

    document.getElementById('search-button').addEventListener('click', buscar);
    document.getElementById('search-bar').addEventListener('input', buscar);
}

// Manejo de errores
function mostrarError(mensaje) {
    document.getElementById('device-list').innerHTML = `
        <tr>
            <td colspan="5" class="error">
                <i class="fas fa-exclamation-triangle"></i> ${mensaje}
            </td>
        </tr>
    `;
}

// Actualización automática
function iniciarActualizacionAutomatica() {
    setInterval(() => {
        if (document.querySelector('.contenedor-dispositivos').style.display === 'block') {
            cargarDispositivos();
        }
    }, 5000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.metric-btn').onclick = toggleVista;
    document.querySelector('.btn-regresar').onclick = toggleVista;

    document.querySelector('.contenedor-dispositivos').style.display = 'none';
    iniciarActualizacionAutomatica();
});

/***** LIMITE MAXIMO DE USUARIOS ******/

// Variables globales
let currentUsers = 0;
let maxUsers = 100;
let updateInterval;

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    updateUserStats();
    loadHistory();

    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Mostrar/ocultar opciones de notificación
    const notificarCheckbox = document.getElementById('notificar');
    if (notificarCheckbox) {
        notificarCheckbox.addEventListener('change', function () {
            const notifOptions = document.getElementById('notifOptions');
            if (notifOptions) notifOptions.style.display = this.checked ? 'flex' : 'none';
        });
    }

    // Inicializar valores del formulario
    const maxUsuariosInput = document.getElementById('maxUsuarios');
    const maxRangeInput = document.getElementById('maxRange');
    if (maxUsuariosInput && maxRangeInput) {
        maxUsuariosInput.value = maxUsers;
        maxRangeInput.value = maxUsers;
    }

    // Lanza actualización inicial y pone intervalo
    actualizarContadores();
    updateInterval = setInterval(actualizarContadores, 1000);
});

// Función para traer datos y actualizar todo dinámicamente
async function actualizarContadores() {
    try {
        const response = await fetch('/contador-logins');
        const data = await response.json();

        if (data.totalLogins !== undefined) {
            currentUsers = data.totalLogins;

            // Actualizar contadores visibles
            document.getElementById('liveUserCount').textContent = currentUsers;
            // Configuraciones de la Red Wifi- span de Dispositivos conectados (ultima opcion)
            document.getElementById('conectadosRouter').textContent = currentUsers;
            document.getElementById('peakToday').textContent = currentUsers * 2;

            const promedio = Math.round((currentUsers + currentUsers * 2) / 2);
            document.getElementById('avgUsage').textContent = promedio;

            // Actualizar barra y porcentaje, y demás stats
            updateUserStats();
        }
    } catch (error) {
        console.error('Error obteniendo el contador:', error);
    }
}

// Actualiza la UI según currentUsers y maxUsers
function updateUserStats() {
    const currentUsersElem = document.getElementById('currentUsers');
    const maxAllowedElem = document.getElementById('maxAllowed');
    const usageBar = document.getElementById('usageBar');
    const usageText = document.getElementById('usageText');
    const indicator = document.getElementById('statusIndicator');
    const lastUpdateTime = document.getElementById('lastUpdateTime');

    if (currentUsersElem) currentUsersElem.textContent = currentUsers;
    if (maxAllowedElem) maxAllowedElem.textContent = maxUsers;

    const usagePercent = maxUsers > 0 ? (currentUsers / maxUsers) * 100 : 0;
    if (usageBar) usageBar.style.width = `${usagePercent}%`;
    if (usageText) usageText.textContent = `${usagePercent.toFixed(1)}% de capacidad`;

    if (indicator) {
        indicator.className = 'status-dot'; // reset classes
        if (usagePercent < 80) {
            indicator.classList.add('active'); // verde
        } else if (usagePercent < 100) {
            indicator.classList.add('warning'); // amarillo
        } else {
            indicator.classList.add('danger'); // rojo
        }
    }

    if (lastUpdateTime) {
        const now = new Date();
        lastUpdateTime.textContent = `Actualizado: ${now.toLocaleTimeString()}`;
    }
}

// Funciones auxiliares (de tu código original, adaptadas si quieres)
function aplicarLimite() {
    const limiteDiv = document.getElementById('limiteMaximoContainer');
    if (limiteDiv) {
        limiteDiv.style.display = 'block';
        updateUserStats();
    }
}

function ocultarLimite() {
    const limiteDiv = document.getElementById('limiteMaximoContainer');
    if (limiteDiv) {
        limiteDiv.style.display = 'none';
    }
    const limiteForm = document.getElementById('limiteForm');
    if (limiteForm) limiteForm.reset();

    const maxUsuariosInput = document.getElementById('maxUsuarios');
    const maxRangeInput = document.getElementById('maxRange');
    if (maxUsuariosInput && maxRangeInput) {
        maxUsuariosInput.value = maxUsers;
        maxRangeInput.value = maxUsers;
    }
}

function openTab(tabId) {
    // Ocultar todos los contenidos de pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Desactivar todos los botones de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');

    // Activar el botón de la pestaña seleccionada
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

function updateMaxInput() {
    const slider = document.getElementById('maxRange');
    const input = document.getElementById('maxUsuarios');
    if (slider && input) {
        input.value = slider.value;
    }
}

function suggestOptimal() {
    const liveUserCountElem = document.getElementById('liveUserCount');
    const maxAllowedElem = document.getElementById('maxAllowed');
    const maxUsuariosInput = document.getElementById('maxUsuarios');
    const maxRangeInput = document.getElementById('maxRange');

    if (!liveUserCountElem || !maxAllowedElem || !maxUsuariosInput || !maxRangeInput) {
        alert('Error al obtener datos para sugerir el límite.');
        return;
    }

    const currentUsers = parseInt(liveUserCountElem.textContent) || 0;
    const currentLimit = parseInt(maxAllowedElem.textContent) || 100;
    const usagePercent = (currentUsers / currentLimit) * 100;

    let suggestedLimit;

    if (usagePercent >= 90) {
        suggestedLimit = Math.ceil(currentLimit * 1.5);
    } else if (usagePercent >= 70) {
        suggestedLimit = Math.ceil(currentLimit * 1.3);
    } else if (usagePercent >= 50) {
        suggestedLimit = Math.ceil(currentLimit * 1.15);
    } else if (usagePercent >= 30) {
        suggestedLimit = currentUsers + 25;  // suficiente margen
    } else {
        suggestedLimit = currentUsers + 15;  // uso muy bajo
    }

    // Asegurar que sea mayor que usuarios actuales
    if (suggestedLimit <= currentUsers) {
        suggestedLimit = currentUsers + 10;
    }

    // Limitar máximo sugerido a 500
    suggestedLimit = Math.min(suggestedLimit, 500);

    maxUsuariosInput.value = suggestedLimit;
    maxRangeInput.value = suggestedLimit;

    alert(`Se sugiere un nuevo límite de ${suggestedLimit} usuarios en base al uso actual (${currentUsers}/${currentLimit}).`);
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    historyList.innerHTML = '';

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-details">
            <div class="history-action">Sistema inicializado</div>
            <div class="history-user">Por Sistema • <span class="history-time">Justo ahora</span></div>
        </div>
        <div class="history-value">Todos los valores en cero</div>
    `;
    historyList.appendChild(historyItem);
}

function addHistoryItem(action, value) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-details">
            <div class="history-action">${action}</div>
            <div class="history-user">Por Admin • <span class="history-time">Ahora mismo</span></div>
        </div>
        <div class="history-value">${value}</div>
    `;

    historyList.insertBefore(historyItem, historyList.firstChild);
}

function testSettings() {
    const newLimit = document.getElementById('maxUsuarios').value;
    const priorityMode = document.getElementById('priorityMode').value;
    const notificarCheckbox = document.getElementById('notificar');

    const notificarEstado = notificarCheckbox && notificarCheckbox.checked ? 'Activadas' : 'Desactivadas';
    const modoTexto = getPriorityModeName(priorityMode);

    // Mostrar modal (tu código ya existente)
    document.getElementById('modalTitle').textContent = 'Resultados de la Prueba';
    document.getElementById('modalMessage').innerHTML = `
        <p>La configuración se ha probado exitosamente:</p>
        <ul>
            <li>Nuevo límite: <strong>${newLimit} usuarios</strong></li>
            <li>Modo de prioridad: <strong>${modoTexto}</strong></li>
            <li>Notificaciones en tiempo real: <strong>${notificarEstado}</strong></li>
        </ul>
        <p>Se recomienda guardar los cambios para aplicarlos al sistema.</p>
    `;
    document.getElementById('confirmModal').style.display = 'flex';

    // Construir HTML con formato para el historial
    const historialHTML = `
        <ul class="historial-lista">
            <li><strong>Límite:</strong> ${newLimit} usuarios</li>
            <li><strong>Modo de prioridad:</strong> ${modoTexto}</li>
            <li><strong>Notificaciones:</strong> ${notificarEstado}</li>
        </ul>
    `;

    // Añadir la entrada al historial
    addHistoryItem('Configuración probada', historialHTML);
}

function getPriorityModeName(value) {
    const modes = {
        'fifo': 'Primero en entrar, primero en salir',
        'priority': 'Por prioridad de usuario'
    };
    return modes[value] || value;
}

function confirmChanges() {
    maxUsers = parseInt(document.getElementById('maxUsuarios').value);
    // currentUsers no se reinicia porque vienen dinámicos

    updateUserStats();
    closeModal();
    alert('Los cambios se han aplicado exitosamente.');

    addHistoryItem('Límite cambiado', maxUsers);
}

function closeModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
}

// Manejar envío del formulario
const limiteForm = document.getElementById('limiteForm');
if (limiteForm) {
    limiteForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newLimit = parseInt(document.getElementById('maxUsuarios').value);

        if (newLimit < 1 || newLimit > 500) {
            alert('Por favor ingrese un valor válido entre 1 y 500');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Confirmar Cambios';
        document.getElementById('modalMessage').textContent = `¿Está seguro que desea cambiar el límite máximo a ${newLimit} usuarios?`;
        document.getElementById('confirmModal').style.display = 'flex';
    });
}

/************* Configuraciones de la Red Wifi (Obtenemos datos) ********************/

// Para mostrar y ocultar la seccion de configuración de la red wifi
document.getElementById('mostrarConfiguracionesWifi').addEventListener('click', function () {
    const divConfiguraciones = document.querySelector('.cambioConfiguracionesWifi');
    divConfiguraciones.style.display = 'block';
    divConfiguraciones.scrollIntoView({ behavior: 'smooth' }); // Hace scroll suave hasta el div
});
function salirDeConfiguracionWifi() {
    document.querySelector('.cambioConfiguracionesWifi').style.display = 'none';
}

// Ocultar contraseña de la red wifi
function togglePassword() {
    const input = document.getElementById("passwordInput");
    const icon = document.getElementById("toggleIcon");
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye-fill");
        icon.classList.add("bi-eye-slash-fill");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash-fill");
        icon.classList.add("bi-eye-fill");
    }
}

function togglePasswordActual() {
    const icon = document.getElementById("toggleIconActual");
    const span = icon.parentElement.parentElement;
    if (span.innerText.includes("*")) {
        span.innerHTML = 'actual_password <span class="toggle-password" onclick="togglePasswordActual()"><i class="bi bi-eye-slash-fill" id="toggleIconActual"></i></span>';
    } else {
        span.innerHTML = '************ <span class="toggle-password" onclick="togglePasswordActual()"><i class="bi bi-eye-fill" id="toggleIconActual"></i></span>';
    }
}

// Función para actualizar el SSID
async function actualizarSSID() {
    try {
        const response = await fetch("/get_ssid");
        const ssid = await response.text();
        document.getElementById("wifiSSID").textContent = ssid;
        document.getElementById("zona-wifiNombre").textContent = ssid;
    } catch (error) {
        console.error("Error al obtener SSID:", error);
        document.getElementById("wifiSSID").textContent = "Sin SSID";
    }
}

// Función para actualizar el estado de conexión
async function actualizarEstadoConexion() {
    try {
        const response = await fetch("/get_connection_status");
        const estado = await response.text();
        const elemento = document.getElementById("verEstado");

        elemento.textContent = estado;

        // Aplicar clases CSS según el estado
        if (estado === "Conectado") {
            elemento.style.color = "#28a745";
            elemento.style.fontWeight = "bold";
            elemento.style.textShadow = "0 0 5px rgba(40, 167, 69, 0.3)";
        } else {
            elemento.style.color = "#dc3545";
            elemento.style.fontWeight = "bold";
            elemento.style.fontStyle = "italic";
        }
    } catch (error) {
        console.error("Error al obtener estado:", error);
        const elemento = document.getElementById("verEstado");
        elemento.textContent = "Error";
        elemento.style.color = "#ffc107";
        elemento.style.fontWeight = "bold";
    }
}

async function actualizarIP() {
    try {
        const response = await fetch("/get_ip");
        const ip = await response.text();
        document.getElementById("obtenerIP").textContent = ip;
    } catch (error) {
        console.error("Error al obtener IP:", error);
        document.getElementById("obtenerIP").textContent = "Error IP";
    }
}

async function actualizarMAC() {
    try {
        const response = await fetch("/get_mac");
        const mac = await response.text();
        document.getElementById("obtenerMAC").textContent = mac;
    } catch (error) {
        console.error("Error al obtener MAC:", error);
        document.getElementById("obtenerMAC").textContent = "No disponible";
    }
}

async function cargarCanalFrecuencia() {
    try {
        const response = await fetch('/canal-frecuencia');
        const data = await response.json();
        document.getElementById('canal-frecuencia').textContent = data.resultado;
    } catch (error) {
        console.error('Error al cargar canal/frecuencia:', error);
        document.getElementById('canal-frecuencia').textContent = 'Error';
    }
}

async function actualizarVelocidadEnlace() {
    try {
        const response = await fetch("/velocidad-enlace");
        const velocidad = await response.text();
        document.getElementById("velocidad-enlace").textContent = velocidad;
    } catch (error) {
        console.error("Error al obtener velocidad:", error);
        document.getElementById("velocidad-enlace").textContent = "Sin datos";
    }
}

async function actualizarAnchoBanda() {
    try {
        const response = await fetch("/ancho-banda");
        const ancho = await response.text();
        document.getElementById("ancho-banda").textContent = ancho;
    } catch (error) {
        console.error("Error al obtener ancho de banda:", error);
        document.getElementById("ancho-banda").textContent = "Sin datos";
    }
}

async function cargarProtocoloRed() {
    try {
        const res = await fetch('/protocolo-red');
        const data = await res.json();
        document.getElementById('protocolo-ver').textContent = data.protocolo;
    } catch (err) {
        console.error('Error al obtener protocolo:', err);
        document.getElementById('protocolo-ver').textContent = 'Error';
    }
}

// Para ver la contraseña Wi-Fi actual
async function actualizarPasswordWiFi() {
    try {
        const response = await fetch("/get_wifi_password");
        const password = await response.text();
        document.getElementById("zona-wifiPassword").textContent = password;
    } catch (error) {
        console.error("Error al obtener contraseña Wi-Fi:", error);
        document.getElementById("zona-wifiPassword").textContent = "Error al obtener contraseña";
    }
}

// Actualizar datos al cargar la página en la seccion de configuracion wifi
window.onload = function () {
    actualizarSSID();
    actualizarEstadoConexion();
    actualizarIP();
    actualizarMAC();
    cargarCanalFrecuencia();
    actualizarVelocidadEnlace();
    actualizarAnchoBanda();
    cargarProtocoloRed();
    actualizarPasswordWiFi()
};

fetch('/tipoSeguridadRed')
    .then(response => response.json())
    .then(data => {
        document.getElementById('tipoSeguridad').textContent = data.seguridad;
    })
    .catch(error => {
        document.getElementById('tipoSeguridad').textContent = 'Error';
    });

// Para actualizar el SSID y la contraseña Wi-Fi
let ssidTemp = "";
let passwordTemp = "";

document.querySelector(".form-red").addEventListener("submit", function (e) {
    e.preventDefault();

    ssidTemp = document.getElementById("ingresarNuevoSSID").value.trim();
    passwordTemp = document.getElementById("passwordInput").value.trim();

    if (!ssidTemp && !passwordTemp) {
        alert("Por favor, ingresa un nuevo valor en SSID y en contraseña.");
        return;
    }

    document.getElementById("modalSSID").textContent = ssidTemp || "(sin cambios)";
    document.getElementById("modalPassword").textContent = passwordTemp || "(sin cambios)";

    document.getElementById("modalConfirmacion").classList.remove("hidden");
});

function confirmarCambios() {
    if (ssidTemp) {
        document.getElementById("zona-wifiNombre").textContent = ssidTemp;
        document.getElementById("wifiSSID").textContent = ssidTemp;
    }

    if (passwordTemp) {
        const passwordField = document.getElementById("zona-wifiPassword");
        passwordField.textContent = passwordTemp;
        passwordField.dataset.password = passwordTemp;
    }

    document.getElementById("ingresarNuevoSSID").value = "";
    document.getElementById("passwordInput").value = "";

    cerrarModal();

    const toast = document.getElementById("toastSuccess");
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2000);
}

function cerrarModal() {
    document.getElementById("modalConfirmacion").classList.add("hidden");
}

function togglePasswordActual() {
    const passwordField = document.getElementById("zona-wifiPassword");
    const actual = passwordField.dataset.password || passwordField.textContent;
    passwordField.textContent =
        passwordField.textContent === actual ? "Oculto" : actual;
}

function togglePassword() {
    const input = document.getElementById("passwordInput");
    input.type = input.type === "password" ? "text" : "password";
}

/******* Boton para reiniciar el router ******/

document.addEventListener('DOMContentLoaded', () => {
    const restartBtn = document.querySelector('.btn-router.reiniciar');
    const modal = document.getElementById('modal-confirm-restart');
    const closeModal = document.getElementById('modal-close-btn');
    const confirmRestart = document.getElementById('confirm-restart-btn');
    const mensaje = document.getElementById('router-status-message');
    const ssidField = document.getElementById('wifiSSID');
    const zonaSSID = document.getElementById('zona-wifiNombre');
    const zonaPass = document.getElementById('zona-wifiPassword');

    restartBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmRestart.addEventListener('click', async () => {
        modal.style.display = 'none';
        mensaje.textContent = 'Reiniciando...';
        mensaje.style.backgroundColor = '#28a745';
        mensaje.style.display = 'block';

        try {
            const [ssidRes, passRes] = await Promise.all([
                fetch('/get_ssid'),
                fetch('/get_wifi_password')
            ]);

            if (!ssidRes.ok || !passRes.ok) throw new Error();

            const ssid = await ssidRes.text();
            const password = await passRes.text();

            if (ssidField) ssidField.textContent = ssid;
            if (zonaSSID) zonaSSID.textContent = ssid;
            if (zonaPass) zonaPass.textContent = password;

            mensaje.textContent = 'Router reiniciado correctamente';
            mensaje.style.backgroundColor = '#28a745';

            setTimeout(() => {
                mensaje.style.display = 'none';
            }, 2000);
        } catch {
            mensaje.textContent = 'Error al reiniciar el router';
            mensaje.style.backgroundColor = '#dc3545';

            setTimeout(() => {
                mensaje.style.display = 'none';
            }, 2000);
        }
    });
});

/********* MODAL DE FIREWALL ***********/

// Mostrar el modal al hacer clic en el botón de firewall
document.querySelector('.btn-router.firewall').addEventListener('click', function () {
    document.getElementById('modalFirewall').style.display = 'flex';
});

// Función para cerrar el modal de firewall
function closeFirewallModal() {
    document.getElementById('modalFirewall').style.display = 'none';
}

document.querySelector('.switch__input').addEventListener('change', function () {
    const label = document.querySelector('.switch__label');
    const firewallContent = document.querySelector('.modal-firewall-content');
    const descriptionText = document.getElementById('descripcion-firewall');

    if (this.checked) {
        // Cuando se activa
        label.textContent = label.getAttribute('data-on');
        firewallContent.textContent = 'Firewall Activado';
        firewallContent.style.backgroundColor = '#28a745';
        firewallContent.style.color = 'white';

        descriptionText.textContent = 'El sistema ahora bloquea conexiones no autorizadas y protege contra accesos externos maliciosos.';
    } else {
        // Cuando se desactiva
        label.textContent = label.getAttribute('data-off');
        firewallContent.textContent = 'Firewall Desactivado';
        firewallContent.style.backgroundColor = '#ff4444';
        firewallContent.style.color = 'white';

        descriptionText.textContent = '¡Advertencia! El sistema es vulnerable a ataques externos sin protección de firewall.';
    }
});

// Función para resetear a estado inicial
function resetFirewallDisplay() {
    const firewallContent = document.querySelector('.modal-firewall-content');
    const descriptionText = document.getElementById('descripcion-firewall');

    firewallContent.textContent = 'Esperando activación del firewall...';
    firewallContent.style.backgroundColor = '#f0f0f0';
    firewallContent.style.color = '#333';

    descriptionText.textContent = 'Activa el Switch para configurar el firewall';
    descriptionText.style.color = 'black';
}

/**************** MODAL DE OPTIMIZAR WIFI **********************/

// Mostrar modal
document.querySelector('.btn-router.optimizar').addEventListener('click', () => {
    document.getElementById('modalOptimizarWifi').style.display = 'flex';
});

// Cerrar modal
function closeOptimizarWifiModal() {
    document.getElementById('modalOptimizarWifi').style.display = 'none';
    resetProgress();
}

// Función para resetear el progreso
function resetProgress() {
    const progressBar = document.getElementById('wifiProgressBar');
    const progressText = document.getElementById('progressText');
    const button = document.getElementById('startOptimizationBtn');
    const contenidoProgreso = document.getElementById('contenidoProgreso');
    const contenidoFinal = document.getElementById('contenidoFinal');
    
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    button.disabled = false;
    button.textContent = "Optimizar";
    button.style.color = "white";
    contenidoProgreso.style.display = 'block';
    contenidoFinal.style.display = 'none';
}

// Función para manejar la optimización
document.getElementById('startOptimizationBtn').addEventListener('click', function() {
    const progressBar = document.getElementById('wifiProgressBar');
    const progressText = document.getElementById('progressText');
    const button = this;
    const contenidoProgreso = document.getElementById('contenidoProgreso');
    const contenidoFinal = document.getElementById('contenidoFinal');
    
    button.disabled = true;
    button.textContent = "Optimizando...";
    button.style.color = "black";
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        if(progress >= 100) {
            clearInterval(interval);
            contenidoProgreso.style.display = 'none';
            contenidoFinal.style.display = 'block';
        }
    }, 30);
});
