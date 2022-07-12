import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { Mascota, TipoMascota } from "./dao/index.js"

const PORT = process.env.PORT || 5000
const app = express()

const corsOptions = {
    origin : ["http://localhost:3000"]
}

app.use(cors(corsOptions)) // CORS
app.use(bodyParser.json()) // configuracion para recibir json por post (cuerpo)

//============================================================================================
// Recurso: Mascotas (/mascotas)

// Endpoint: Obtener lista de mascotas
// GET /mascotas?edad=5 
app.get("/mascotas", async (req, resp) => {
    const edadMascota = req.query.edad
    let mascotas;
    if (edadMascota == undefined){
        mascotas = await Mascota.findAll()
    }else {
        mascotas = await Mascota.findAll({
            where : {
                edad : edadMascota
            }
        })
    }
    
    let mascotasConTipo = []
    for (let masc of mascotas) {
        const tipoMascota = await TipoMascota.findByPk(masc.idTipoMascota)
        mascotasConTipo.push({
            id : masc.id,
            nombre : masc.nombre,
            edad : masc.edad,
            birthday : masc.birthday,
            tipo : tipoMascota
        })
    }

    resp.send(JSON.stringify(mascotasConTipo))
})

// Endpoint: Obtener una mascota segun el id
// GET "/mascota/<ID_MASCOTA>"
app.get("/mascota/:id", async (req, resp)=> {
    const idMascota = req.params.id

    const mascota = await Mascota.findByPk(idMascota)

    if (mascota != null) {
        const tipoMascota = await TipoMascota.findByPk(mascota.idTipoMascota)
        const mascotaConTipo = {
            id : mascota.id,
            nombre : mascota.nombre,
            edad : mascota.edad,
            birthday : mascota.birthday,
            tipo : tipoMascota
        }
        resp.send(mascotaConTipo)
    }else {
        resp.status(400).send("ERROR: No existe id de mascota")
    }
})

// Endpoint: Agregar una nueva mascota
// POST /mascotas
app.post("/mascotas", async (req, resp) => {
    const mascota = req.body
    
    await Mascota.create({
        nombre : mascota.nombre,
        edad : mascota.edad,
        birthday : mascota.birthday,
        idTipoMascota : mascota.idTipoMascota
    })

    resp.send("OK")
})

// Endpoint: Modificar una mascota ya existente
// PUT /mascotas
app.put("/mascotas", async (req, resp) => {
    const mascota = req.body

    await Mascota.update(mascota, {
        where : {
            id : mascota.id
        }
    })

    resp.send("OK")
})

// Endpoint: Eliminar una mascota ya existente
// DELETE /mascotas
app.delete("/mascotas/:id", async (req, resp) => {
    const idMascota = req.params.id

    const filasDestruidas = await Mascota.destroy({
        where : {
            id : idMascota
        }
    })

    if (filasDestruidas > 0) {
        resp.send("OK")
    }else {
        resp.status(400).send("ERROR: No existe id de mascota")
    }
})

//============================================================================================

// Recurso: TipoMascota (/tipomascotas)
app.get("/tipomascotas", async (req, resp) => {
    resp.send(await TipoMascota.findAll())
})

app.get("/tipomascota/:id", async (req, resp) => {
    const idTipoMascota = req.params.id

    if (idTipoMascota != null) {
        const tipoMascota = await TipoMascota.findByPk(idTipoMascota)
        if (tipoMascota != null) {
            resp.send(tipoMascota)
        }else {
            resp.status(400).send("ERROR: Id de TipoMascota no existe")
        }
    }else {
        resp.status(400).send("ERROR: Debe ingresar un id")
    }
})

app.post("/tipomascotas", async (req, resp) => {
    const mascota = req.body
    await TipoMascota.create({
        nombre : mascota.nombre,
        activo : mascota.activo
    })
    resp.send("OK")
})

app.put("/tipomascotas", (req, resp) => {

})

app.delete("/tipomascotas/:id", (req, resp) => {

})


//============================================================================================




app.listen(PORT, () => {
    console.log(`Servidor inicial en puerto ${PORT}`)
})