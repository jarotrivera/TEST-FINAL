const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Post = sequelize.define('Post', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false }
});

Post.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });
User.hasMany(Post, { foreignKey: 'usuarioId', as: 'posts' });

module.exports = Post;
