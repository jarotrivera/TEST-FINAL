const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');
const Post = require('./postModel');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  postId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    }
  }
});

// Asociaciones
Comment.belongsTo(User, { foreignKey: 'userId', as: 'usuarioComentario' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comentariosUsuario' });

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'postRelacionado' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comentariosPost' });

module.exports = Comment;


module.exports = Comment;
