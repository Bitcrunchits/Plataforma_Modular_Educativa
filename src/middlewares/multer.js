import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extensión original
        const uniqueName = uuidv4() + ext; // Nombre único con UUID + extensión
        cb(null, uniqueName);
    },
});

// Validación de tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        // Documentos
        'application/pdf', // PDF
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-powerpoint', // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'application/vnd.ms-excel', // XLS
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        
        // Imágenes
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        
        // Texto
        'text/plain',
        'application/rtf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Formatos permitidos: PDF, Word, Excel, PowerPoint, imágenes y texto.`), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // Límite de 15MB
        files: 5 // Máximo 5 archivos por petición
    }
});

export default upload;