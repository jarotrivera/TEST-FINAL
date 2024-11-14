// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gastosRoutes = require('./routes/gastosRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const historialRoutes = require('./routes/historialRoutes');

// Importar modelos para sincronizar las asociaciones
const User = require('./models/userModel');
const Post = require('./models/postModel');
const Venta = require('./models/ventaModel');
const Comment = require('./models/Comment');

// Configurar las asociaciones entre los modelos

// Asociaciones entre User y Post
User.hasMany(Post, { foreignKey: 'usuarioId', as: 'userPosts' });
Post.belongsTo(User, { foreignKey: 'usuarioId', as: 'autorPost' });

// Asociaciones entre User y Venta
User.hasMany(Venta, { foreignKey: 'usuarioId', as: 'userVentas' });
Venta.belongsTo(User, { foreignKey: 'usuarioId', as: 'autorVenta' });

// Asociaciones entre User y Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'userComments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'comentador' });

// Asociaciones entre Post y Comment
Post.hasMany(Comment, { foreignKey: 'postId', as: 'postComments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'comentarioPost' });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api', reportRoutes);
app.use('/api/historial', historialRoutes);

// Sincronizar la base de datos
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada');
  app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
  });
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});

