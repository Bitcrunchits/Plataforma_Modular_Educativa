import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = uuidv4() + ext;
        cb(null, uniqueName);
    },
});

// Filtro mejorado para tipos de archivo
const fileFilter = (req, file, cb) => {
    // Lista de extensiones permitidas
    const allowedExtensions = [
        // Imágenes
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
        // Documentos
        '.pdf', 
        // Word
        '.doc', '.docx', '.dot', '.dotx',
        // Excel
        '.xls', '.xlsx', '.xlsm', '.csv',
        // PowerPoint ✅ AGREGADOS
        '.ppt', '.pptx', '.pps', '.ppsx', '.pot', '.potx',
        // Texto
        '.txt', '.rtf',
        // Comprimidos
        '.zip', '.rar'
    ];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de archivo no permitido: ${fileExtension}. Extensiones permitidas: ${allowedExtensions.join(', ')}`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB (aumentado para PowerPoint)
        files: 10 // Máximo 10 archivos en upload múltiple
    }
});

// Middlewares preconfigurados para fácil uso
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
export const uploadAny = upload.any();

export default upload;