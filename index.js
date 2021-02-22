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
    console.log(test.mensaje)
})

app.listen(PORT, ()=> console.log(`Servidor corriendo en puerto ${PORT}`));

//Ruta
app.get('/',(req,res)=>{
    res.send("Bienvenido a mi API!");
})

//Obtener Todas las peliculas
app.get('/peliculas/', (req, res)=> {
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

app.get('/peliculas/:id', (req, res)=> {
    if (req.params!=null && req.params!=""){
        const {id }= req.params
        const sql = `SELECT * from pelicula where pelicula_id = ${id}`;
        var numero_res = 4;
        var mensaje_res = "El servicio esta temporalmente caido. Intente mas tarde.";
        Connection.query(sql, (error, results)=>{
            if (error) {
                numero_res = 2; 
                mensaje_res = "Ha habido un error con tu consulta." +error;
            } else if (results.length>0){
                res.json(results);
            } else {
                numero_res = 3; 
                mensaje_res = "El id de Pelicula que indicas, no existe.";
            }
            if (!results.length>0){
                var resultados = {
                    id: numero_res,
                    mensaje: mensaje_res
                }
                res.send(resultados);    
            }
        })
    }
    else {
        var numero_res = 5;
        var mensaje_res = "No ha ingresado el numero de pelicula";
        var resultados = {
            id: numero_res,
            mensaje: mensaje_res
        }
        res.send(resultados);
    }
})

app.post('/agregar', (req, res)=> {
    var numero_res = 4;
    var mensaje_res = "El servicio esta temporalmente caido. Intente mas tarde.";
    const sql = 'INSERT INTO `pelicula` SET ?';
    const custumerObj = {
        nombre_pelicula: req.body.nombre_pelicula,
        Distribuidor: req.body.Distribuidor
    }
    if(req.body.nombre_pelicula==null || req.body.Distribuidor==null){
        numero_res = 3; 
        mensaje_res = "Uno o mas valores no se relleno, creacion de pelicula cancelada.";
        const resultados = {
            id: numero_res,
            mensaje: mensaje_res
        }
        res.send(resultados);
    } else {
        Connection.query(sql, custumerObj, error => {
            if (error) {
                numero_res = 2; 
                mensaje_res = "Ha habido un error y no se ha podido completar la operacion." + error;
            } else{
                numero_res = 1; 
                mensaje_res = "Pelicula creada exitosamente";

            }
            const resultados = {
                id: numero_res,
                mensaje: mensaje_res
            }
            res.send(resultados);  
        })
    }
})

app.put('/actualizar/', (req, res)=> {
    const resultados = {
        id: 5,
        mensaje: "No ha ingresado el numero de pelicula a actualizar"
    }
    res.send(resultados);
})

app.put('/actualizar/:id', (req, res)=> {
    const {id}= req.params;
    const {nombre_pelicula, Distribuidor} = req.body;
    const sql = `UPDATE pelicula SET
    nombre_pelicula='${nombre_pelicula}', Distribuidor='${Distribuidor}' 
    WHERE pelicula_id = ${id}`;
    if(req.body.nombre_pelicula==null || req.body.Distribuidor==null){
        numero_res = 3; 
        mensaje_res = "Uno o mas valores no se relleno, creacion de pelicula cancelada.";
        const resultados = {
            id: numero_res,
            mensaje: mensaje_res
        }
        res.send(resultados);
    } else {
        Connection.query(sql, error => {
            if (error) {
                numero_res = 2; 
                mensaje_res = "Ha habido un error y no se ha podido completar la operacion." + error;
                const resultados = {
                    id: numero_res,
                    mensaje: mensaje_res
                }
                res.send(resultados);
            } else{
                const peliculavar = {
                    id: req.params,
                    nombre_pelicula: req.body.nombre_pelicula,
                    Distribuidor: req.body.Distribuidor
                }
                res.send(peliculavar);
            }
        })
    }
})

app.delete('/eliminar/', (req, res)=> {
    const resultados = {
        id: 5,
        mensaje: "No ha ingresado el numero de pelicula a eliminar"
    }
    var numero_res = 5;
    res.send(resultados);
})

app.delete('/eliminar/:id', (req, res)=> {
    const {id}= req.params;
    const sql = `DELETE FROM pelicula WHERE pelicula_id = ${id}`;
    Connection.query(sql, error => {
        if (error) {
            numero_res = 2; 
            mensaje_res = "Ha habido un error y no se ha podido completar la operacion." + error;
        } else{
            numero_res = 1; 
            mensaje_res = "Pelicula eliminada correctamente";
        }
        const resultados = {
            id: numero_res,
            mensaje: mensaje_res
        }
        res.send(resultados);
    })
})

