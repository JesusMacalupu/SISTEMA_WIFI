const express = require('express');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuración de la base de datos 
const dbConfig = {
    user: 'sa',
    password: '12345',
    server: 'LAPTOP-LBB057TI',  
    port: 1433,        
    database: 'WifiSistema',
    options: {
        encrypt: false,  
        trustServerCertificate: true 
    }
};

// Conectar a la base de datos
async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Conexión exitosa a la base de datos WifiSistema');
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
    }
}
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Función para incrementar el contador en la base de datos
async function incrementarContadorLogins() {
    const pool = await sql.connect(dbConfig);
    await pool.request()
        .query('UPDATE ContadorLogins SET total_logins = total_logins + 1 WHERE id = 1');
}

// Ruta para registrar usuarios (solo registro, sin contar logins aquí)
app.post('/registro', async (req, res) => {
    const { nombre, fecha_nacimiento, correo, telefono } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.NVarChar(100), nombre)
            .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
            .input('correo', sql.NVarChar(100), correo)
            .input('telefono', sql.NVarChar(20), telefono)
            .query("INSERT INTO Usuarios (nombre, fecha_nacimiento, correo, telefono) VALUES (@nombre, @fecha_nacimiento, @correo, @telefono)");

        res.json({ success: true, message: '📡 Conexión WI-FI Establecida.' });
    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Ruta para iniciar sesión (incrementa contador en base de datos si login es exitoso)
app.post('/login', async (req, res) => {
    const { nombre, fecha_nacimiento, correo, telefono } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('telefono', sql.NVarChar(20), telefono)
            .query("SELECT * FROM Usuarios WHERE telefono = @telefono");

        if (result.recordset.length > 0) {
            const usuario = result.recordset[0];
            if (
                usuario.nombre === nombre && 
                new Date(usuario.fecha_nacimiento).toISOString().split('T')[0] === fecha_nacimiento && 
                usuario.correo === correo && 
                usuario.telefono === telefono
            ) {
                // Incrementar contador solo si login exitoso
                await incrementarContadorLogins();
                res.json({ success: true, message: '📡 Conexión WI-FI Establecida.' });
            } else {
                res.json({ success: false, message: '⚠️ Credenciales incorrectas.' });
            }
        } else {
            // Usuario no existe, insertar nuevo
            await pool.request()
                .input('nombre', sql.NVarChar(100), nombre)
                .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
                .input('correo', sql.NVarChar(100), correo)
                .input('telefono', sql.NVarChar(20), telefono)
                .query("INSERT INTO Usuarios (nombre, fecha_nacimiento, correo, telefono) VALUES (@nombre, @fecha_nacimiento, @correo, @telefono)");

            // Incrementar contador porque nuevo usuario también cuenta como login exitoso
            await incrementarContadorLogins();
            res.json({ success: true, message: '📡 Conexión WI-FI Establecida.' });
        }
    } catch (error) {
        console.error('\n❌ Error en el inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    } 
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log('📌 Presiona Ctrl + C para detener el servidor.');
});
