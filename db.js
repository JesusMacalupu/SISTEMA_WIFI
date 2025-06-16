const sql = require('mssql');

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

let connectionPool;

async function getConnection() {
    if (!connectionPool) {
        try {
            connectionPool = await sql.connect(dbConfig);
            console.log('✅ Conectado a la base de datos WifiSistema');
        } catch (err) {
            console.error('❌ Error conectando a la base de datos:', err);
            throw err;
        }
    }
    return connectionPool;
}

module.exports = {
    getConnection,
    sql
};
