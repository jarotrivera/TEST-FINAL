const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'railway',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQLPASSWORD || '', 
  {
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: console.log, // Habilitar logging para ver las consultas que se ejecutan (opcional)
  }
);

// Prueba la conexión inmediatamente
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();

module.exports = sequelize;