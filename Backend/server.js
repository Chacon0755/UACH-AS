const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Content-Type", 'application/json');
  next();
});

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', 
  password: 'password', 
  database: 'uach_as' 
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
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
  connection.query('SELECT * FROM Alumnos', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { matricula, nombre, ape1, ape2, programa, semestre } = req.body;
  const query = 'INSERT INTO Alumnos (matricula, nombre, ape1, ape2, programa, semestre) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [matricula, nombre, ape1, ape2, programa, semestre], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Alumno agregado correctamente');
  });
});

// Actualizar un alumno
app.put('/alumnos/:matricula', (req, res) => {
  const { nombre, ape1, ape2, programa, semestre } = req.body;
  const { matricula } = req.params;
  const query = 'UPDATE Alumnos SET nombre = ?, ape1 = ?, ape2 = ?, programa = ?, semestre = ? WHERE matricula = ?';
  connection.query(query, [nombre, ape1, ape2, programa, semestre, matricula], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Alumno actualizado correctamente');
  });
});

// Eliminar un alumno
app.delete('/alumnos/:matricula', (req, res) => {
  const { matricula } = req.params;
  const query = 'DELETE FROM Alumnos WHERE matricula = ?';
  connection.query(query, [matricula], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Alumno eliminado correctamente');
  });
});


// Obtener todas las carreras
app.get('/carreras', (req, res) => {
  connection.query('SELECT * FROM carrera', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar una nueva carrera
app.post('/carrera', (req, res) => {
  const { Id_Carreras, Nombre_Carrera } = req.body;
  const query = 'INSERT INTO carrera (Id_Carreras, Nombre_Carrera) VALUES (?, ?)';
  connection.query(query, [Id_Carreras, Nombre_Carrera], (error, results) => {
    if (error) {
      console.error('Error al insertar carrera ', error)
      return res.status(500).json({ message: 'Error al agregar carrera', error: error.sqlMessage });
    }
      res.status(201).json({message: 'Carrera agregada correctamente', data: results})
  });
});

// Actualizar una carrera
app.put('/carreras/:id', (req, res) => {
  const { Nombre_Carrera } = req.body;
  const { id } = req.params;
  const query = 'UPDATE carrera SET Nombre_Carrera = ? WHERE Id_Carreras = ?';
  connection.query(query, [Nombre_Carrera, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Carrera actualizada correctamente');
  });
});

// Eliminar una carrera
app.delete('/carreras/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM carrera WHERE Id_Carreras = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Carrera eliminada correctamente');
  });
});

// Obtener todos los semestres
app.get('/semestres', (req, res) => {
  connection.query('SELECT * FROM semestre', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar un nuevo semestre
app.post('/semestres', (req, res) => {
  const { id, sem } = req.body;
  const query = 'INSERT INTO semestre (id, sem) VALUES (?, ?)';
  connection.query(query, [id, sem], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Semestre agregado correctamente');
  });
});

// Actualizar un semestre
app.put('/semestres/:id', (req, res) => {
  const { sem } = req.body;
  const { id } = req.params;
  const query = 'UPDATE semestre SET sem = ? WHERE id = ?';
  connection.query(query, [sem, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Semestre actualizado correctamente');
  });
});

// Eliminar un semestre
app.delete('/semestres/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM semestre WHERE id = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Semestre eliminado correctamente');
  });
});

// Obtener todas las materias
app.get('/materias', (req, res) => {
  connection.query('SELECT * FROM Materias', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar una nueva materia
app.post('/materias', (req, res) => {
  const { Id_Materias, N_Carr, N_Sem, N_Mat } = req.body;
  const query = 'INSERT INTO Materias (Id_Materias, N_Carr, N_Sem, N_Mat) VALUES (?, ?, ?, ?)';
  connection.query(query, [Id_Materias, N_Carr, N_Sem, N_Mat], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Materia agregada correctamente');
  });
});

// Actualizar una materia
app.put('/materias/:id', (req, res) => {
  const { N_Carr, N_Sem, N_Mat } = req.body;
  const { id } = req.params;
  const query = 'UPDATE Materias SET N_Carr = ?, N_Sem = ?, N_Mat = ? WHERE Id_Materias = ?';
  connection.query(query, [N_Carr, N_Sem, N_Mat, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Materia actualizada correctamente');
  });
});

// Eliminar una materia
app.delete('/materias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Materias WHERE Id_Materias = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Materia eliminada correctamente');
  });
});

// Obtener todos los docentes
app.get('/docentes', (req, res) => {
  connection.query('SELECT * FROM docentes', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar un nuevo docente
app.post('/docentes', (req, res) => {
  const { Id_docente, Nombre, Apellido, id_mat_as, id_carrera_mat } = req.body;
  const query = 'INSERT INTO docentes (Id_docente, Nombre, Apellido, id_mat_as, id_carrera_mat) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [Id_docente, Nombre, Apellido, id_mat_as, id_carrera_mat], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Docente agregado correctamente');
  });
});

// Actualizar un docente
app.put('/docentes/:id', (req, res) => {
  const { Nombre, Apellido, id_mat_as, id_carrera_mat } = req.body;
  const { id } = req.params;
  const query = 'UPDATE docentes SET Nombre = ?, Apellido = ?, id_mat_as = ?, id_carrera_mat = ? WHERE Id_docente = ?';
  connection.query(query, [Nombre, Apellido, id_mat_as, id_carrera_mat, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Docente actualizado correctamente');
  });
});

// Eliminar un docente
app.delete('/docentes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM docentes WHERE Id_docente = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Docente eliminado correctamente');
  });
});

// Obtener todas las publicaciones del foro
app.get('/foro', (req, res) => {
  connection.query('SELECT * FROM foro', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar una nueva publicación en el foro
app.post('/foro', (req, res) => {
  const { Publicacion, Comentarios } = req.body;
  const query = 'INSERT INTO foro (Publicacion, Comentarios) VALUES (?, ?)';
  connection.query(query, [Publicacion, Comentarios], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Publicación agregada correctamente');
  });
});

// Actualizar una publicación en el foro
app.put('/foro/:id', (req, res) => {
  const { Publicacion, Comentarios } = req.body;
  const { id } = req.params;
  const query = 'UPDATE foro SET Publicacion = ?, Comentarios = ? WHERE id_publicacion = ?';
  connection.query(query, [Publicacion, Comentarios, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Publicación actualizada correctamente');
  });
});

// Eliminar una publicación en el foro
app.delete('/foro/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM foro WHERE id_publicacion = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Publicación eliminada correctamente');
  });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { id_user, users } = req.body;
  const query = 'INSERT INTO usuarios (id_user, users) VALUES (?, ?)';
  connection.query(query, [id_user, users], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Usuario agregado correctamente');
  });
});

// Actualizar un usuario
app.put('/usuarios/:id', (req, res) => {
  const { users } = req.body;
  const { id } = req.params;
  const query = 'UPDATE usuarios SET users = ? WHERE id_user = ?';
  connection.query(query, [users, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Usuario actualizado correctamente');
  });
});

// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id_user = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Usuario eliminado correctamente');
  });
});

// Obtener todas las asesorias
app.get('/asesorias', (req, res) => {
  connection.query('SELECT * FROM asesorias', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Insertar una nueva asesoria
app.post('/asesorias', (req, res) => {
  const { id_as, alumn_ases, docente_ases, dia, hora } = req.body;
  const query = 'INSERT INTO asesorias (id_as, alumn_ases, docente_ases, dia, hora) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [id_as, alumn_ases, docente_ases, dia, hora], (error, results) => {
      if (error) return res.status(500).send(error);
      res.status(201).send('Asesoría agregada correctamente');
  });
});

// Actualizar una asesoria
app.put('/asesorias/:id', (req, res) => {
  const { alumn_ases, docente_ases, dia, hora } = req.body;
  const { id } = req.params;
  const query = 'UPDATE asesorias SET alumn_ases = ?, docente_ases = ?, dia = ?, hora = ? WHERE id_as = ?';
  connection.query(query, [alumn_ases, docente_ases, dia, hora, id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Asesoría actualizada correctamente');
  });
});

// Eliminar una asesoria
app.delete('/asesorias/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM asesorias WHERE id_as = ?';
  connection.query(query, [id], (error, results) => {
      if (error) return res.status(500).send(error);
      res.send('Asesoría eliminada correctamente');
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
