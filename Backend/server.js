const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const multer = require('multer')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Content-Type", 'application/json');
  next();
});

//Configurar multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Ruta de inicio de sesion
app.post('/login', (req, res) => {
  console.log('req.body ', req.body);
  const { email, password } = req.body;
  console.log('Credenciales: ', {email, password});
  const findUserQuery = `
  SELECT 'admin' AS role, admin_id as id, contraseña AS password, nombre AS name, perfil AS profilePicture   FROM administrador WHERE correo = ?
  UNION
  SELECT 'student' AS role, matricula as id, Contra_alum as password, nombre As name, perfil AS profilePicture FROM alumnos WHERE correo = ?
  UNION
  SELECT 'teacher' AS role, Id_docente as id, contra_docente AS password, nombre_doc As name, perfil AS profilePicture FROM docentes WHERE correo = ?
  `
  connection.query(findUserQuery, [email, email, email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor', error: error.sqlMessage });
    }

    if (results.length === 0) {
      console.error(error, results);
      return res.status(401).json({ message: 'Correo  incorrecto' });
    }

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      console.error('contrasena incorrecta')
      return res.status(401).json({ message: 'contraseña incorrecta' });
    }

    const token = jwt.sign({
      id: user.id, role: user.role, name: user.name, 
    }, 'tu_secreto', {
      expiresIn: '1h'
    });
    res.status(200).json({ token });
    console.log({ token });
  });
});

app.get('/asesorias/alumno/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      a.id_as,
      h.dia,
      h.hora_inicio,
      d.nombre_doc AS nombre_docente,
      d.Apellido AS apellido_docente,
      m.N_Mat AS nombre_materia,
      CASE 
        WHEN a.modalidad = TRUE THEN 'Presencial'
        ELSE 'Virtual'
      END AS modalidad
    FROM asesorias a
    JOIN horarios h ON a.id_docente_horario = h.id_horario
    JOIN docentes d ON a.id_docente = d.Id_docente
    JOIN materias m ON a.id_materia = m.Id_Materias
    WHERE a.id_alumno = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener asesorías del alumno: ', error);
      return res.status(500).json({ message: 'Error al obtener asesorías del alumno', error: error.sqlMessage });
    }
    console.log('studentId:', id)
    console.log('Asesorias del alumno obtenidas correctamente: ', results)
    res.status(200).json(results);
  });
});


// Ruta para crear una asesoría
app.post('/asesorias', (req, res) => {
  const { id_alumno, id_docente, id_horario, id_materia, modalidad } = req.body;

  const insertAdvisoryQuery = `
    INSERT INTO asesorias (id_alumno, id_docente, id_docente_horario, id_materia, modalidad)
    VALUES (?, ?, ?, ?, ?)
  `;

  const updateScheduleQuery = `
    UPDATE docente_horario
    SET ocupado = TRUE
    WHERE id_docente = ? AND id_horario = ?
  `;

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al crear asesoría', error: error.sqlMessage });
    }

    // Inserta la nueva asesoría
    connection.query(insertAdvisoryQuery, [id_alumno, id_docente, id_horario, id_materia, modalidad], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al insertar asesoría: ', error);
          res.status(500).json({ message: 'Error al crear asesoría', error: error.sqlMessage });
        });
      }

      console.log('Asesoría creada correctamente: ', results);

      // Actualiza el horario del docente
      connection.query(updateScheduleQuery, [id_docente, id_horario], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al actualizar horario del docente: ', error);
            res.status(500).json({ message: 'Error al crear asesoría', error: error.sqlMessage });
          });
        }

        console.log('Horario del docente actualizado correctamente: ', results);

        // Confirma la transacción
        connection.commit(error => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al confirmar la transacción: ', error);
              res.status(500).json({ message: 'Error al crear asesoría', error: error.sqlMessage });
            });
          }

          res.status(201).json({ message: 'Asesoría creada correctamente' });
        });
      });
    });
  });
});

//Crear admins
app.post('/admin', (req, res) => {
  const {admin_id, correo, contraseña, nombre, apellido1, apellido2, rol } = req.body
  const query = 'INSERT INTO administrador (admin_id, correo, contraseña, nombre, apellido1, apellido2, rol) VALUES (?, ?, ?, ?, ?, ?, ?)'
  const hashedPassword = bcrypt.hashSync(contraseña, 10)
  connection.query(query, [admin_id, correo, hashedPassword, nombre, apellido1, apellido2, rol], (error, results) => {
    if (error) {
      console.error('Error al crear admin ', error)
      return res.status(500).json({ message: 'Error al crear admin', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Admin creado correctamente', data: results });
    console.log('Admin creado correctamente: ', results)
  })
})

// Obtener admin por Id
app.get('/admin/:id', (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM administrador WHERE admin_id = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener datos del  admin ', error)
      return res.status(500).json({ message: 'Error al obtener datos del  admin ', error: error.sqlMessage });
    }
    res.status(200).json(results)
    console.log('Datos del admin obtenidos correctamente ', results)
  });
});

//obtener foto de perfil de admin
app.get('/admin/profile-image/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT perfil from administrador WHERE admin_id = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor', error: error.sqlMessage });
    }
    if (results.lenght === 0) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const profilePicture = results[0].perfil;
    res.setHeader('Content-Type', 'image/jpeg')
    res.send(profilePicture);
    console.log(profilePicture)
  });
});

//Cambiar foto de perfil del admin
app.post('/admin/upload-profile/:id', upload.single('perfil'), (req, res) => {
  const { id } = req.params;
  const perfilBuffer = req.file.buffer;

  const profilePictureQuery = 'UPDATE administrador set perfil = ? WHERE admin_id = ?';
  connection.query(profilePictureQuery, [perfilBuffer, id], (error, results) => {
    if (error) {
      console.error('Error al subir foto de perfil del admin ', error)
      return res.status(500).json({ message: 'Error al subir foto del perfil del admin', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Foto de perfil del admin subida correctamente', data: results });
    console.log('Foto de perfil del admin subida correctamente: ', results)
  });
});

// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
  connection.query('SELECT * FROM alumnos', (error, results) => {
    if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Obtener alumno por Id
app.get('/alumnos/:id', (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM alumnos WHERE matricula = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener datos del  alumno ', error)
      return res.status(500).json({ message: 'Error al obtener datos del  alumno ', error: error.sqlMessage });
    }
    res.status(200).json(results);
    console.log('Datos del  alumno obtenidos con exito', results)
  });
});

// Obtener programa, ID de carrera y nombre de carrera de un alumno específico por matrícula
app.get('/alumnos/carrera/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT alumnos.programa, carrera.Id_Carreras AS id_carrera, carrera.Nombre_Carrera AS nombre_carrera
    FROM alumnos
    JOIN carrera ON alumnos.programa = carrera.Id_Carreras
    WHERE alumnos.matricula = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (results.length > 0) {
      res.json(results[0]); // Asegurarse de devolver un solo objeto
    } else {
      res.status(404).json({ message: 'Alumno no encontrado' });
    }
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

//obtener foto de perfil de estudiante
app.get('/alumnos/profile-image/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT perfil from alumnos WHERE matricula = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor', error: error.sqlMessage });
    }
    if (results.lenght === 0) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const profilePicture = results[0].perfil;
    res.setHeader('Content-Type', 'image/jpeg')
    res.send(profilePicture);
    console.log(profilePicture)
  });
});

// Insertar un nuevo alumno
app.post('/alumnos', (req, res) => {
  const { matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, Contra_alum } = req.body;
  const hashedPassword = bcrypt.hashSync(Contra_alum, 10)
  const query = 'INSERT INTO Alumnos (matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, Contra_alum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [matricula, nombre, ape1, ape2, programa, semestre, correo, perfil, rol, hashedPassword], (error, results) => {
    if (error) {
      console.error('Error al crear alumno ', error)
      return res.status(500).json({ message: 'Error al crear alumno', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Alumno creado correctamente', data: results });
    console.log('Alumno creado correctamente: ', results)
  });
});

//Cambiar foto de perfil
app.post('/alumnos/upload-profile/:id', upload.single('perfil'), (req, res) => {
  const { id } = req.params;
  const perfilBuffer = req.file.buffer;

  const profilePictureQuery = 'UPDATE Alumnos set perfil = ? WHERE matricula = ?';
  connection.query(profilePictureQuery, [perfilBuffer, id], (error, results) => {
    if (error) {
      console.error('Error al subir foto de perfil del alumno ', error)
      return res.status(500).json({ message: 'Error al subir foto del perfil del alumno', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Foto de perfil del alumno subida correctamente', data: results });
    console.log('Foto de perfil del alumno subida correctamente: ', results)
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

  const updateDocentesQuery = 'UPDATE docentes SET id_mat_as = 0, id_carrera_mat = 0 WHERE id_carrera_mat = ?';
  const deleteMateriasQuery = 'DELETE FROM materias WHERE N_Carr = ?';
  const deleteCarrerasQuery = 'DELETE FROM carrera WHERE Id_Carreras = ?';
  const deleteCourseTeacherQuery = 'DELETE FROM Docente_Materia WHERE id_materia IN (SELECT Id_Materias FROM materias WHERE N_Carr = ?)';

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
    }

    // Actualiza los docentes relacionados
    connection.query(updateDocentesQuery, [id], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al actualizar docentes relacionados: ', error);
          res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
        });
      }

      console.log('Docentes relacionados actualizados correctamente: ', results);

      // Elimina las relaciones en la tabla intermedia para las materias de la carrera
      connection.query(deleteCourseTeacherQuery, [id], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al eliminar relaciones de materias del docente: ', error);
            res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
          });
        }

        console.log('Relaciones de materias eliminadas correctamente: ', results);

        // Elimina las materias relacionadas
        connection.query(deleteMateriasQuery, [id], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al eliminar materias relacionadas: ', error);
              res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
            });
          }

          console.log('Materias relacionadas eliminadas correctamente: ', results);

          // Elimina la carrera
          connection.query(deleteCarrerasQuery, [id], (error, results) => {
            if (error) {
              return connection.rollback(() => {
                console.error('Error al eliminar carrera: ', error);
                res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
              });
            }

            // Si todo ha ido bien, confirma la transacción
            connection.commit(error => {
              if (error) {
                return connection.rollback(() => {
                  console.error('Error al confirmar la transacción: ', error);
                  res.status(500).json({ message: 'Error al eliminar carrera', error: error.sqlMessage });
                });
              }

              res.status(200).json({ message: 'Carrera eliminada correctamente, materias relacionadas eliminadas correctamente y docentes relacionados actualizados correctamente' });
              console.log('Carrera eliminada correctamente: ', results);
            });
          });
        });
      });
    });
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
  const updateDocentesQuery = 'UPDATE docentes SET id_mat_as = 0 WHERE id_mat_as = ?';
  const deleteCourseTeacherQuery = 'DELETE FROM Docente_Materia WHERE id_materia = ?';
  const deleteMateriasQuery = 'DELETE FROM Materias WHERE Id_Materias = ?';

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al eliminar materia', error: error.sqlMessage });
    }

    // Actualiza los docentes relacionados
    connection.query(updateDocentesQuery, [id], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al actualizar docentes relacionados: ', error);
          res.status(500).json({ message: 'Error al eliminar materia', error: error.sqlMessage });
        });
      }

      console.log('Docentes relacionados actualizados correctamente: ', results);

      // Elimina las relaciones en la tabla intermedia
      connection.query(deleteCourseTeacherQuery, [id], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al eliminar relaciones de la materia: ', error);
            res.status(500).json({ message: 'Error al eliminar materia', error: error.sqlMessage });
          });
        }

        console.log('Relaciones de la materia eliminadas correctamente: ', results);

        // Elimina la materia
        connection.query(deleteMateriasQuery, [id], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al eliminar materia: ', error);
              res.status(500).json({ message: 'Error al eliminar materia', error: error.sqlMessage });
            });
          }

          // Si todo ha ido bien, confirma la transacción
          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                console.error('Error al confirmar la transacción: ', error);
                res.status(500).json({ message: 'Error al eliminar materia', error: error.sqlMessage });
              });
            }

            res.status(200).json({ message: 'Materia eliminada correctamente y docentes actualizados' });
            console.log('Materia eliminada correctamente: ', results);
          });
        });
      });
    });
  });
});

// Obtener todos los docentes
app.get('/docentes', (req, res) => {
  connection.query('SELECT * FROM docentes', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
  });
});

// Obtener docente por Id
app.get('/docentes/:id', (req, res) => {
  const { id } = req.params
  const query = 'SELECT * FROM docentes WHERE Id_docente = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener datos del  docente ', error)
      return res.status(500).json({ message: 'Error al obtener datos del  docente ', error: error.sqlMessage });
    }
    res.status(200).json(results);
    console.log('Datos del docente obtenidos correctamente ', results)
  });
});

//Obtener docentes por id de materia
app.get('/docentes/materia/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT docentes.Id_docente, docentes.nombre_doc, docentes.Apellido, docentes.id_mat_as, docentes.id_carrera_mat, docentes.correo, docentes.apei2, docentes.perfil, docentes.rol_doc
    FROM docentes
    JOIN Docente_Materia ON docentes.Id_docente = Docente_Materia.id_docente
    WHERE Docente_Materia.id_materia = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al recuperar docentes: ', error);
      return res.status(500).json({ message: 'Error al recuperar docentes', error: error.sqlMessage });
    }
    res.json(results);
  });
});

// Obtener horarios disponibles de un docente
app.get('/docentes/:id/horarios-disponibles', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT h.id_horario, h.hora_inicio, h.dia
    FROM docente_horario dh
    JOIN horarios h ON dh.id_horario = h.id_horario
    WHERE dh.id_docente = ? AND dh.ocupado = FALSE
  `;
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al obtener horarios disponibles: ', error);
      return res.status(500).json({ message: 'Error al obtener horarios disponibles', error: error.sqlMessage });
    }
    res.json(results);
  });
});

//obtener foto de perfil de docente
app.get('/docentes/profile-image/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT perfil from docentes WHERE Id_docente = ?'
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error en el servidor', error: error.sqlMessage });
    }
    if (results.lenght === 0) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const profilePicture = results[0].perfil;
    res.setHeader('Content-Type', 'image/jpeg')
    res.send(profilePicture);
    console.log(profilePicture)
  });
});

//Cambiar foto de perfil del docente
app.post('/docentes/upload-profile/:id', upload.single('perfil'), (req, res) => {
  const { id } = req.params;
  const perfilBuffer = req.file.buffer;

  const profilePictureQuery = 'UPDATE docentes set perfil = ? WHERE Id_docente = ?';
  connection.query(profilePictureQuery, [perfilBuffer, id], (error, results) => {
    if (error) {
      console.error('Error al subir foto de perfil del docente ', error)
      return res.status(500).json({ message: 'Error al subir foto del perfil del docente', error: error.sqlMessage });
      }
    res.status(201).json({ message: 'Foto de perfil del docente subida correctamente', data: results });
    console.log('Foto de perfil del docente subida correctamente: ', results)
  });
});

//crear docentes
app.post('/docentes', (req, res) => {
  const { Id_docente, nombre_doc, Apellido, id_carrera_mat, id_mat_as, courseIds, scheduleIds, correo, apei2, perfil, rol_doc, contra_docente } = req.body;
  const hashedPassword = bcrypt.hashSync(contra_docente, 10);
  
  const insertTeacherQuery = 'INSERT INTO docentes (Id_docente, nombre_doc, Apellido, id_mat_as, id_carrera_mat, correo, apei2, perfil, rol_doc, contra_docente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const insertCourseTeacherQuery = 'INSERT INTO Docente_Materia (id_docente, id_materia) VALUES ?';
  const insertHorarioTeacherQuery = 'INSERT INTO Docente_Horario (id_docente, id_horario) VALUES ?';

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
    }

    // Inserta el docente
    connection.query(insertTeacherQuery, [Id_docente, nombre_doc, Apellido, id_carrera_mat, id_mat_as, correo, apei2, perfil, rol_doc, hashedPassword], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al insertar docente: ', error);
          res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
        });
      }

      console.log('Docente creado correctamente: ', results);

      // Prepara los datos para la tabla intermedia Docente_Materia
      const courseTeacherValues = courseIds.map(courseId => [Id_docente, courseId]);

      // Inserta las materias en la tabla intermedia
      connection.query(insertCourseTeacherQuery, [courseTeacherValues], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al insertar materias del docente: ', error);
            res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
          });
        }

        console.log('Materias del docente insertadas correctamente: ', results);
        //u8KDsgJH
        // Prepara los datos para la tabla intermedia Docente_Horario
        const horarioTeacherValues = scheduleIds.map(horarioId => [Id_docente, horarioId]);

        // Inserta los horarios en la tabla intermedia
        connection.query(insertHorarioTeacherQuery, [horarioTeacherValues], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al insertar horarios del docente: ', error);
              res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
            });
          }

          console.log('Horarios del docente insertados correctamente: ', results);

          // Si todo ha ido bien, confirma la transacción
          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                console.error('Error al confirmar la transacción: ', error);
                res.status(500).json({ message: 'Error al crear docente', error: error.sqlMessage });
              });
            }

            res.status(201).json({ message: 'Docente creado correctamente' });
            console.log('Docente y sus relaciones insertados correctamente.');
          });
        });
      });
    });
  });
});

// Actualiza el docente
app.put('/docentes/:id', (req, res) => {
  const { nombre_doc, Apellido, id_carrera_mat, id_mat_as, courseIds, scheduleIds, correo, apei2, perfil, rol_doc } = req.body;
  const { id } = req.params;

  const updateTeacherQuery = 'UPDATE docentes SET nombre_doc = ?, Apellido = ?, id_carrera_mat = ?, correo = ?, apei2 = ?, perfil = ?, rol_doc = ? WHERE Id_docente = ?';
  const deleteCourseTeacherQuery = 'DELETE FROM Docente_Materia WHERE id_docente = ?';
  const insertCourseTeacherQuery = 'INSERT INTO Docente_Materia (id_docente, id_materia) VALUES ?';
  const deleteScheduleTeacherQuery = 'DELETE FROM Docente_Horario WHERE id_docente = ?';
  const insertScheduleTeacherQuery = 'INSERT INTO Docente_Horario (id_docente, id_horario, ocupado) VALUES ?';

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
    }

    // Actualiza el docente
    connection.query(updateTeacherQuery, [nombre_doc, Apellido, id_carrera_mat, correo, apei2, perfil, rol_doc, id], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al editar docente: ', error);
          res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
        });
      }

      console.log('Docente editado correctamente: ', results);

      // Elimina las relaciones actuales en la tabla intermedia Docente_Materia
      connection.query(deleteCourseTeacherQuery, [id], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al eliminar relaciones de materias del docente: ', error);
            res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
          });
        }

        console.log('Relaciones de materias eliminadas correctamente: ', results);

        // Prepara los datos para la tabla intermedia Docente_Materia
        const courseTeacherValues = courseIds.map(courseId => [id, courseId]);

        // Inserta las nuevas relaciones en la tabla intermedia Docente_Materia
        connection.query(insertCourseTeacherQuery, [courseTeacherValues], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al insertar nuevas relaciones de materias del docente: ', error);
              res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
            });
          }

          console.log('Nuevas relaciones de materias insertadas correctamente: ', results);

          // Elimina las relaciones actuales en la tabla intermedia Docente_Horario
          connection.query(deleteScheduleTeacherQuery, [id], (error, results) => {
            if (error) {
              return connection.rollback(() => {
                console.error('Error al eliminar relaciones de horarios del docente: ', error);
                res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
              });
            }

            console.log('Relaciones de horarios eliminadas correctamente: ', results);

            // Prepara los datos para la tabla intermedia Docente_Horario
            const scheduleTeacherValues = scheduleIds.map(scheduleId => [id, scheduleId, false]); // `false` para `ocupado`
            console.log(scheduleTeacherValues);

            // Inserta las nuevas relaciones en la tabla intermedia Docente_Horario
            connection.query(insertScheduleTeacherQuery, [scheduleTeacherValues], (error, results) => {
              if (error) {
                return connection.rollback(() => {
                  console.error('Error al insertar nuevas relaciones de horarios del docente: ', error);
                  res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
                });
              }

              // Si todo ha ido bien, confirma la transacción
              connection.commit(error => {
                if (error) {
                  return connection.rollback(() => {
                    console.error('Error al confirmar la transacción: ', error);
                    res.status(500).json({ message: 'Error al editar docente', error: error.sqlMessage });
                  });
                }

                res.status(201).json({ message: 'Docente editado correctamente' });
                console.log('Nuevas relaciones de horarios insertadas correctamente: ', results);
              });
            });
          });
        });
      });
    });
  });
});


// Eliminar un docente
app.delete('/docentes/:id', (req, res) => {
  const { id } = req.params;
  const deleteTeacherQuery = 'DELETE FROM docentes WHERE Id_docente = ?';
  const deleteCourseTeacherQuery = 'DELETE FROM Docente_Materia WHERE id_docente = ?';

  // Inicia una transacción
  connection.beginTransaction(error => {
    if (error) {
      console.error('Error al iniciar la transacción: ', error);
      return res.status(500).json({ message: 'Error al eliminar docente', error: error.sqlMessage });
    }

    // Elimina las relaciones en la tabla intermedia
    connection.query(deleteCourseTeacherQuery, [id], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al eliminar relaciones de materias del docente: ', error);
          res.status(500).json({ message: 'Error al eliminar docente', error: error.sqlMessage });
        });
      }

      console.log('Relaciones de materias eliminadas correctamente: ', results);

      // Elimina el docente
      connection.query(deleteTeacherQuery, [id], (error, results) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al eliminar docente: ', error);
            res.status(500).json({ message: 'Error al eliminar docente', error: error.sqlMessage });
          });
        }

        // Si todo ha ido bien, confirma la transacción
        connection.commit(error => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al confirmar la transacción: ', error);
              res.status(500).json({ message: 'Error al eliminar docente', error: error.sqlMessage });
            });
          }

          res.status(201).json({ message: 'Docente eliminado correctamente' });
          console.log('Docente eliminado correctamente: ', results);
        });
      });
    });
  });
});

//Obtener todos los horarios
app.get('/horarios', (req, res) => {
  const query = 'SELECT * FROM horarios';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener horarios ', error);
      return res.status(500).json({ message: 'Error al obtener horarios', error: error.sqlMessage });
    }
    res.json(results);
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

//cerrar la conexion
process.on('SIGINT', () => {
    connection.end(() => {
        console.log('Conexión a la base de datos cerrada');
        process.exit();
    });
});
