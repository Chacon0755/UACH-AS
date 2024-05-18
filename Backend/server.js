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


// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
  connection.query('SELECT * FROM alumnos', (error, results) => {
    if (error) return res.status(500).send(error);
      res.json(results);
  });
});

//Obtener alumnos y nombre de carrera`
app.get('/alumnos/carrera', (req, res) => {
  const query = 'SELECT alumnos. *, carrera.Nombre_Carrera as nombre_carrera, semestre.sem as nombre_semestre FROM alumnos JOIN carrera ON alumnos.programa = carrera.Id_Carreras JOIN semestre ON alumnos.semestre = semestre.id';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// Insertar un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, Contra_alum } = req.body;
  const query = 'INSERT INTO Alumnos (matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, Contra_alum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, Contra_alum], (error, results) => {
    if (error) {
      console.error('Error al crear alumno ', error)
      return res.status(500).json({ message: 'Error al crear alumno', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Alumno creado correctamente', data: results });
    console.log('Alumno creado correctamente: ', results)
  });
});

// Actualizar un alumno
app.put('/alumnos/:matricula', (req, res) => {
  const { nombre, ape1, ape2, programa, semestre, correo, perfil, rol } = req.body;
  const { matricula } = req.params;
  const query = 'UPDATE Alumnos SET nombre = ?, ape1 = ?, ape2 = ?, programa = ?, semestre = ?, correo = ?, perfil = ?, rol =?  WHERE matricula = ?';
  connection.query(query, [nombre, ape1, ape2, programa, semestre, correo, perfil, rol, matricula], (error, results) => {
    if (error) {
      console.error('Error al editar alumno ', error)
      return res.status(500).json({ message: 'Error al editar alumno', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Alumno editado correctamente', data: results });
    console.log('Alumno editado correctamente: ', results)
  });
});

// Eliminar un alumno
app.delete('/alumnos/:matricula', (req, res) => {
  const { matricula } = req.params;
  const query = 'DELETE FROM Alumnos WHERE matricula = ?';
  connection.query(query, [matricula], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar alumno', error: error.sqlMessage });
    }
      res.status(201).json({ message: 'Alumno eliminado correctamente', data: results });
    console.log('Alumno eliminado correctamente: ', results)
  });
});


// Obtener todas las carreras
app.get('/carrera', (req, res) => {
  connection.query('SELECT * FROM carrera', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});


//Obtener todos los ids de las carreras
app.get('/carreras/ids', (req, res) => {
  const query = 'SELECT Id_Carreras FROM carrera';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los ids de las carreras ', error);
          return res.status(500).json({ message: 'Error al obtener los IDs de las carreras', error });
      }
      const ids = results.map(result => result.Id_Carreras);
      res.json(ids);
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
app.put('/carrera/:id', (req, res) => {
  const { Id_Carreras, Nombre_Carrera } = req.body;
  const { id } = req.params;
  const query = 'UPDATE carrera SET Nombre_Carrera = ? WHERE Id_Carreras = ?';
  connection.query(query, [Nombre_Carrera, id], (error, results) => {
    if (error) {
      console.error('Error al editar carrera ', error)
      return res.status(500).json({ message: 'Error al editar carrera', error: error.sqlMessage });
    }
    res.status(201).json({ message: 'Carrera editada correctamente', data: results });
    console.log('Carrera editada correctamente: ', results)
  });
});


// Eliminar una carrera
app.delete('/carrera/:id', (req, res) => {
  const { id } = req.params;

  const updateDocentes = new Promise((resolve, reject) => {
    const updateDocentesQuery = 'UPDATE docentes SET id_mat_as = 0, id_carrera_mat = 0 WHERE id_carrera_mat = ?';
    connection.query(updateDocentesQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        return reject({ message: 'Error al actualizar docentes relacionados ', error: error.sqlMessage });
      }
      resolve(results);
      console.log('Docentes relacionados actualizados correctamente ', results)
    });
  });

  const deleteMaterias = new Promise((resolve, reject) => {
    const deleteMateriasQuery = 'DELETE FROM materias WHERE N_Carr = ?';
    connection.query(deleteMateriasQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        return reject({ message: 'Error al eliminar materias relacionadas ', error: error.sqlMessage });
      }
      resolve(results);
      console.log('Materias relacionados eliminadas correctamente ', results)
    });
  });

  const deleteCarreras = new Promise((resolve, reject) => {
    const deleteCarrerasQuery = 'DELETE FROM carrera WHERE Id_Carreras = ?';
    connection.query(deleteCarrerasQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        return reject({ message: 'Error al eliminar Carrera ', error: error.sqlMessage });
      }
      resolve(results);
      console.log('Carrera eliminada correctamente ', results)
    });
  });

  updateDocentes.then(() => deleteMaterias).then(() => deleteCarreras).then((results) => {
    res.status(200).json({ message: 'Carrera eliminada correctamente, materias relacionada eliminadas correctamente y docentes relacionados actualizados correctamente' });
  }).catch((error) => {
      res.status(500).json(error)
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

//Obtener materias y nombre de carrera
app.get('/materias/carreras', (req, res) => {
  const query = 'SELECT materias.*, carrera.Nombre_Carrera as nombre_carrera, semestre.sem as nombre_semestre FROM materias JOIN carrera ON materias.N_Carr = carrera.Id_Carreras JOIN semestre ON materias.N_Sem = semestre.id';
  connection.query(query, (error, results) => {
    if (error) return res.status(500).send(error);
    res.json(results)
  });
});

// Obtener materias con cierto MajorID
app.get('/materias/:N_Carr', (req, res) => {
  const N_Carr = req.params.N_Carr;
  if (!N_Carr) {
    return res.status(400).send('El ID de la carrera es necesario');
  }
  connection.query('SELECT * FROM Materias WHERE N_Carr = ?', [N_Carr], (error, results) => {
    if (error) return res.status(500).json(error);
    res.json(results)
  });
});

// Insertar una nueva materia
app.post('/materias', (req, res) => {
  const { Id_Materias, N_Carr, N_Sem, N_Mat } = req.body;
  const query = 'INSERT INTO Materias (Id_Materias, N_Carr, N_Sem, N_Mat) VALUES (?, ?, ?, ?)';
  connection.query(query, [Id_Materias, N_Carr, N_Sem, N_Mat], (error, results) => {
    if (error) {
      console.error('Error al insertar carrera ', error)
      return res.status(500).json({ message: 'Error al agregar materias', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'materia agregada correctamente', data: results });
    console.log('Materia agregada correctamente: ', results)
  });
});

// Actualizar una materia
app.put('/materias/:id', (req, res) => {
  const { N_Carr, N_Sem, N_Mat } = req.body;
  const { id } = req.params;
  const query = 'UPDATE Materias SET N_Carr = ?, N_Sem = ?, N_Mat = ? WHERE Id_Materias = ?';
  connection.query(query, [N_Carr, N_Sem, N_Mat, id], (error, results) => {
    if (error) {
      console.error('Error al editar carrera ', error)
      return res.status(500).json({ message: 'Error al editar materia', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Materia editada correctamente', data: results });
    console.log('Materia editada correctamente: ', results);
  });
});

// Eliminar una materia
app.delete('/materias/:id', (req, res) => {
  const { id } = req.params;
  const updateDocentes = new Promise((resolve, reject) => {
    const updateDocentesQuery = 'UPDATE docentes SET id_mat_as = 0 WHERE id_mat_as = ?';
  connection.query(updateDocentesQuery, [id], (error, results) => {
    if (error) {
      console.error(error);
      return reject({ message: 'Error al actualizar docentes relacionados', error: error.sqlMessage });
    }
    resolve(results);
    console.log('Docentes relacionados actualizados correctamente: ', results)
  });
  });

  const deleteMaterias = new Promise((resolve, reject) => {
    const query = 'DELETE FROM Materias WHERE Id_Materias = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error(error);
        return reject({ message: 'Error al eliminar materia', error: error.sqlMessage });
      }
      resolve(results);
      console.log('Materia eliminada correctamente: ', results)
    });
  });
  updateDocentes.then(() => deleteMaterias).then((results) => {
      res.status(200).json({ message: 'Materia eliminada correctamente y docentes actualizados', data: results });
    })
    .catch((error) => {
      res.status(500).json(error);
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
  const { Id_docente, nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc, contra_docente} = req.body;
  const query = 'INSERT INTO docentes (Id_docente, nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc, contra_docente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [Id_docente, nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc, contra_docente], (error, results) => {
    if (error) {
      console.error({ Contra_docente })
      console.error('Error al insertar docente ', error)
      return res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Docente creado correctamente', data: results })
    console.log('Docente creado correctamente: ', results);
  });
});

// Actualizar un docente
app.put('/docentes/:id', (req, res) => {
  const { nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc} = req.body;
  const { id }    = req.params
  const query = 'UPDATE docentes SET nombre_doc = ?, Apellido = ?, id_mat_as = ?, id_carrera_mat = ?, correo = ?, apei2 = ?, perfil = ?, rol_doc = ?  WHERE Id_docente = ?';
  connection.query(query, [nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc, id], (error, results) => {
    if (error) {
      console.error('Error al editar docente: ', error)
      console.error('params: ',req.params)
      return res.status(500).json({ message: 'Error al editar Docente ', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Docente editado correctamente', data: results });
    console.log('Docente editado correctamente: ', results);
    console.log('req.body', req.body);
    console.log(req.params);
    // console.log(Id_docente);
  });
});

// Eliminar un docente
app.delete('/docentes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM docentes WHERE Id_docente = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar alumno', error: error.sqlMessage });
    }
      res.status(201).json({ message: 'Alumno eliminado correctamente', data: results });
      console.log('Alumno eliminado correctamente: ', results)
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
