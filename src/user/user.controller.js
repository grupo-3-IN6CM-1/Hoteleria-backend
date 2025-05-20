import User from '../user/user.model.js';
import argon2 from 'argon2';

export const updateMyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.usuario;

    if (id !== loggedUser._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: 'No tienes permiso para editar otro perfil.',
      });
    }

    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado.',
      });
    }

    res.json({
      success: true,
      msg: 'Perfil actualizado correctamente.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar el perfil.',
      error: error.message,
    });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.usuario;

    if (loggedUser.role !== 'PLATFORM_ADMIN') {
      return res.status(403).json({
        success: false,
        msg: 'Solo los administradores de plataforma pueden editar otros perfiles.',
      });
    }

    const updateData = { ...req.body };
    if ('password' in updateData) {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado.',
      });
    }

    res.json({
      success: true,
      msg: 'Usuario actualizado correctamente.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar el usuario.',
      error: error.message,
    });
  }
};
