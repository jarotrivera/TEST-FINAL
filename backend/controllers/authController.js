const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Configuración del servicio de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'geocentrocomunidad@gmail.com',
    pass: 'asgw dgdk mjqs xeok', // Aquí utilizas tu contraseña de aplicación
  },
});

// Controlador para solicitar la recuperación de contraseña
const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar un token de recuperación
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiration = Date.now() + 3600000; // 1 hora de expiración
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Personalizar el correo con estilos
    const mailOptions = {
      from: 'geocentrocomunidad@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #007bff;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Restablecer Contraseña</a>
          <p>Este enlace expira en 1 hora.</p>
          <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
          <hr />
          <p style="font-size: 0.8em; text-align: center;">Comunidad Geocentro</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
  }
};

// Controlador para restablecer la contraseña
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const user = await User.findOne({
      where: { resetToken: token, tokenExpiration: { [Op.gt]: Date.now() } }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Actualizar la contraseña
    user.password = nuevaPassword;
    user.resetToken = null;
    user.tokenExpiration = null;
    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

// Controlador de inicio de sesión
const login = async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const user = await User.findOne({ where: { nombre } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
  try {
    // Aquí cambiamos 'req.userId' por 'req.user.id'
    const user = await User.findByPk(req.user.id, { 
      attributes: ['id', 'nombre', 'email', 'role'] 
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ 
      id: user.id, 
      nombre: user.nombre, 
      email: user.email, 
      role: user.role 
    });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// Exportar controladores
module.exports = {
  login,
  getUserProfile,
  recuperarPassword,
  resetPassword
};
