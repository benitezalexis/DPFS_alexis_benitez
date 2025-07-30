// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración del almacenamiento dinámico por tipo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
    let tipo='';
       if (req.session.usuario) {
         tipo = 'clientesLogos';
       } else if (req.session.admin) {
         tipo = 'usuariosLogos';
       }


      const dir = path.join(__dirname, '..', 'public', 'images', tipo);

      fs.mkdirSync(dir, { recursive: true }); // crear si no existe
      cb(null, dir);
    } catch (error) {
      console.error('Error en destino de almacenamiento:', error);
      cb(error); // pasar error a multer
    }
  },
  filename: function (req, file, cb) {
    try {
      let ci ='';
      
        if (req.session.usuario) {
          tipo = 'cliente';
          ci = req.session.usuario?.ruc_ci;
        } else if (req.session.admin) {
          ci = req.session.admin?.ruc_ci;
        }


      const ext = path.extname(file.originalname);
      cb(null, `logo_${ci}${ext}`);
    } catch (error) {
      console.error('Error generando nombre de archivo:', error);
      cb(error); // pasar error a multer
    }
  }
});

// Filtro para validar tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
