const express = require('express');
const mysql = require('mysql');
const bodyParser = require ('body-parser');
const PORT = process.env.PORT || 3050;
const app = express();

app.use(bodyParser.json());

//Base de datos
var Connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'cinemapi'
});

//Checkear Coneccion
Connection.connect(error => {
    if(error) throw error;
    console.log('Base de datos corriendo correctamente')
})

app.listen(PORT, ()=> console.log(`Servidor corriendo en puerto ${PORT}`));

//Ruta
app.get('/',(req,res)=>{
    res.send("Bienvenido a mi API!");
})

//Obtener Todas las peliculas
app.get('/peliculas', (req, res)=> {
    const sql = 'SELECT * from pelicula';

    Connection.query(sql, (error, results)=>{
        if (error) throw error;
        if (results.length>0){
            res.json(results);
        } else {
            res.send('Sin resultados')
        }
    })
})

app.get('/pelicula/:id', (req, res)=> {
    const {id }= req.params
    const sql = `SELECT * from pelicula where pelicula_id = ${id}`;
    Connection.query(sql, (error, results)=>{
        if (error) throw error;
        if (results.length>0){
            res.json(results);
        } else {
            res.send('Sin resultados')
        }
    })
})

app.post('/agregar', (req, res)=> {
    const sql = 'INSERT INTO `pelicula` SET ?';
    const custumerObj = {
        pelicula_id: req.body.pelicula_id,
        nombre_pelicula: req.body.nombre_pelicula,
        Distribuidor: req.body.Distribuidor
    }
    Connection.query(sql, custumerObj, error => {
        if (error) throw error;
        res.send('Pelicula Creada Exitosamente');
    })
})

app.put('/actualizar/:id', (req, res)=> {
    const {id}= req.params;
    const {nombre_pelicula, Distribuidor} = req.body;
    const sql = `UPDATE pelicula SET
    nombre_pelicula='${nombre_pelicula}', Distribuidor='${Distribuidor}' 
    WHERE pelicula_id = ${id}`;
    Connection.query(sql, error => {
        if (error) throw error;
        res.send('Pelicula Actualizada Exitosamente');
    })
})

app.delete('/eliminar/:id', (req, res)=> {
    const {id}= req.params;
    const sql = `DELETE FROM pelicula WHERE pelicula_id = ${id}`;
    Connection.query(sql, error => {
        if (error) throw error;
        res.send('Pelicula  Eliminada Exitosamente');
    })
})

