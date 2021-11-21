var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app= express();
app.use(express.json());
app.use(cors());
//Se establecen los parametros
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'andamios'
});

//se prueba la conexion
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conexion exitosa a la base de datos");
    }
})

app.get('/', function(req, res){
    res.send('Ruta INICIO');
});

//Mostrar clientes
app.get('/api/clientes', (req, res)=>{
    conexion.query('SELECT * FROM clientes', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//Mostrar un cliente en especifico
app.get('/api/clientes/:id', (req, res)=>{
    conexion.query('SELECT * FROM clientes WHERE id=?', [req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

//Crear un cliente
app.post('/api/clientes', (req,res)=>{
    let data = {nombres:req.body.nombres, apellidos:req.body.apellidos, tipodoc:req.body.tipodoc, documento:req.body.documento, numero:req.body.numero, clasificacion:req.body.clasificacion}
    let sql = "INSERT INTO clientes SET ?";
    conexion.query(sql, data, function(err, results){
        if(err){
           throw err;
        }else{              
            Object.assign(data, {id: results.insertId })
            res.send(data)   
        }
    })
})

//editar cliente
app.put('/api/clientes/:id', (req, res)=>{
    let id = req.params.id;
    let nombres = req.body.nombres;
    let apellidos = req.body.apellidos;
    let tipodoc = req.body.tipodoc;
    let documento = req.body.documento;
    let numero = req.body.numero;
    let clasificacion = req.body.clasificacion;
    let sql = "UPDATE clientes SET nombres = ?, apellidos = ?, tipodoc = ?, documento = ?, numero = ?, clasificacion = ? WHERE id = ?";
    conexion.query(sql, [nombres, apellidos, tipodoc, documento, numero, clasificacion, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
})

//eliminar cliente
app.delete('/api/clientes/:id', (req, res)=>{
    conexion.query("DELETE FROM clientes WHERE id = ?", [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Servidor ok en puerto: "+puerto);
});