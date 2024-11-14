const User = require('./userModel');
const Venta = require('./ventaModel');
const Post = require('./postModel');
const Comment = require('./Comment');

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

// Exportar todos los modelos para su uso en otros archivos
module.exports = { User, Venta, Post, Comment };
