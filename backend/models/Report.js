const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Post = require('./postModel');

class Report extends Model {}

Report.init({
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'id'
    },
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Report',
  timestamps: true // Asegúrate de que los timestamps estén habilitados
});

Post.hasMany(Report, { foreignKey: 'postId', as: 'reports' });
Report.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = Report;
