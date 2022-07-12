import { Sequelize, DataTypes } from "sequelize"

// Conexion a la base de datos postgres
// Cadena de conexion:
// Postgres: postgres://<USER>:<PWD>@<HOST(IP o DOMINIO)>:5432/<DB_NAME>

//Ahora se debe crear una variable de entorno en el localhost para que utilice la variable de la base de datos local
//Para crear la variable de entorno se utiliza editar variables de entorno
//const CADENA_CONEXION = "postgres://veterinaria:veterinaria@localhost:5432/veterinariadb"
//Cuando se conecte a la nube va a conseguir la variable de entorno de la nube
const CADENA_CONEXION = process.env.DATABASE_URL
let sequelize;
//Cuando entra a producción en Heroku, la variable NODE_ENV tiene el valor production
if (process.env.NODE_ENV == "production") { 
    sequelize = new Sequelize(CADENA_CONEXION, {
        dialectOptions: {
            ssl: {
                require : true,
                rejectUnauthorized : false
            }
        }
    })
} else {
    sequelize = new Sequelize(CADENA_CONEXION, {
        dialect : "postgres"
    })
}

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