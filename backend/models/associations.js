const User = require('./userModel');
const Venta = require('./ventaModel');

// Definir las asociaciones aquí
User.hasMany(Venta, { foreignKey: 'usuarioId', as: 'ventasUsuario' });
Venta.belongsTo(User, { foreignKey: 'usuarioId', as: 'VentaUser' });

module.exports = { User, Venta };
