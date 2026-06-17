
//Inicio de servidor 
app.listen(PORT,() => {
    try {
        console.log('Servidor corriendo en el puerto: ', PORT);
    } catch (error) {
        console.log("Error al iniciar el servidor: ", error);
    }
});

//peticion de guardar en base de datos
app.post("/create", (req, res)=>{
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    db.query('INSERT INTO empleados(nombre, edad, pais, cargo, anios) VALUES(?, ?, ?, ?, ?)', [nombre,edad,pais,cargo,anios],
        (err,result)=>{
            if(err){
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});   

// obtener los datos
app.get("/empleados", (req, res)=>{
    db.query('SELECT * FROM  empleados',
        (err,result)=>{
            if(err){
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});  

// peticion actualizacion datos
app.put("/update", (req, res)=>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    db.query('UPDATE empleados SET  nombre=?, edad=?, pais=?, cargo=?, anios=? WHERE id=?',[nombre,edad,pais,cargo,anios,id],
        (err,result)=>{
            if(err){
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});   

// eleminar datos 
app.delete("/delete/:id", (req, res)=>{
    const id = req.params.id;

    db.query('DELETE FROM empleados  WHERE id=?',id,
        (err,result)=>{
            if(err){
                console.log(err);
            }else {
                res.send(result);
            }
        }
    );
});   


