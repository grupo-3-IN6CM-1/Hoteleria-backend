export const validarPermisoEdicion = (req, res, next) => {
    const idEditar = req.params.id; 
    const usuarioLogeado = req.usuario;  
  
    if (idEditar === usuarioLogeado._id.toString()) {
      return next(); 
    }
  
    if (usuarioLogeado.role !== 'PLATFORM_ADMIN') {
      return res.status(403).json({
        success: false,
        msg: "No tienes permiso para editar otros usuarios",
      });
    }
  
    next();
  };
  