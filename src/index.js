import app from './app.js'; //importamos app para crear el servidor
import { testConnection } from './db/db.js';
import { runSeed } from '../seeds/seed.js'; // Importamos la función runSeed

const main = () => {
    const port = app.get('port');

    app.listen(port, async () =>{
        console.log('server listening on port', port);
        await testConnection (); //!esta funcion testea la conexion a la DB. IMPORTANTISIMA 
        // await runSeed ();
        
    });
}

main();

