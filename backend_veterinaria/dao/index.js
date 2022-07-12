import { Sequelize, DataTypes } from "sequelize"

// Conexion a la base de datos postgres
// Cadena de conexion:
// Postgres: postgres://<USER>:<PWD>@<HOST(IP o DOMINIO)>:5432/<DB_NAME>

//const CADENA_CONEXION = "postgres://veterinaria:veterinaria@localhost:5432/veterinariadb"
const CADENA_CONEXION = process.env.DATABASE_URL
const sequelize = new Sequelize(CADENA_CONEXION)

// Definir nuestra entidades
const Mascota = sequelize.define("Mascota", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : DataTypes.STRING(100),
    edad : DataTypes.INTEGER,
    birthday : {
        type : DataTypes.DATE,
        allowNull : false
    },
    idTipoMascota : DataTypes.UUID
},{
    freezeTableName : true,
    timestamps : false
})

const TipoMascota = sequelize.define("TipoMascota", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : DataTypes.STRING(100),
    activo : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    }
},{
    freezeTableName : true,
    timestamps : false
})

const Veterinario = sequelize.define("Veterinario", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : DataTypes.STRING(200)
})

const Atencion = sequelize.define("Atencion", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    idMascota : {
        type : DataTypes.UUID,
        allowNull : false
    },
    idVeterinario : {
        type : DataTypes.UUID,
        allowNull : false
    }
})

// RELACIONES
Mascota.belongsTo(TipoMascota, {
    foreignKey : "idTipoMascota"
})
TipoMascota.hasMany(Mascota, {
    foreignKey : "id"
})

Atencion.belongsTo(Mascota, {
    foreignKey : "idMascota"
})
Mascota.hasMany(Atencion, {
    foreignKey : "id"
})

Atencion.belongsTo(Veterinario, {
    foreignKey : "idVeterinario"
})
Veterinario.hasMany(Atencion, {
    foreignKey : "id"
})

export { Mascota, TipoMascota, Atencion, Veterinario }