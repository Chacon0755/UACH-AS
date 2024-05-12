const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario', // Cambia 'tu_usuario' por tu usuario real de MySQL
  password: 'tu_contraseña', // Cambia 'tu_contraseña' por tu contraseña real
  database: 'tu_base_de_datos' // Cambia 'tu_base_de_datos' por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    return console.error('Error de conexión: ' + err.stack);
  }
  console.log('Conectado a la base de datos con el ID ' + connection.threadId);
});

// Sirve archivos estáticos desde la carpeta public 
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que sirve tu archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ejemplo de una ruta que realiza una consulta SQL
app.get('/data', (req, res) => {
  connection.query('SELECT * FROM tu_tabla', (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Iniciar tu servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en localhost:' + PORT);
});

// No olvides cerrar la conexión cuando tu servidor se cierre
process.on('SIGINT', () => {
    connection.end(() => {
        console.log('Conexión a la base de datos cerrada');
        process.exit();
    });
});
