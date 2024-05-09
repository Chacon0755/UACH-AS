const express = require ('express');
const path = require ('path');
const app = express();

//Sirve archivos estaticos desde la carpeta public 
app.use(express.static(path.join(__dirname, 'public')));

//Ruta principal que sirve tu archivo HTML
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));

});

//Iniciar tu servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en local host ')
});