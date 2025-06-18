import app from './app.js'; //importamos app para crear el servidor
import { testConnection } from './db/db.js';



const main = () => {
    const port = app.get('port');

    app.listen(port, async () =>{
        console.log('server listening on port', port);
        await testConnection (); //!esta funcion testea la conexion a la DB. IMPORTANTISIMA 
    });
}

main();
