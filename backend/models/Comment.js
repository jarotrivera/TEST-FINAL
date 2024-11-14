const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');
const Post = require('./postModel');

const Comment = sequelize.define('Comment', {
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  postId: { type: DataTypes.INTEGER, allowNull: false }
});

Comment.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

module.exports = Comment;
