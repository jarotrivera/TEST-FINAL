// server.js
const path = require('path');
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
require('./models/associations');
require('dotenv').config();
const commentRoutes = require('./routes/commentRoutes');

// Importar modelos para sincronizar las asociaciones
const User = require('./models/userModel');
const Post = require('./models/postModel');
const Venta = require('./models/ventaModel');
const Comment = require('./models/Comment');

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
app.use('/api/comments', commentRoutes);

// ** Servir el frontend compilado solo en producción **
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  // Cualquier ruta que no coincida con las rutas API, devolverá el `index.html`
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Sincronizar la base de datos y arrancar el servidor
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: true })
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
