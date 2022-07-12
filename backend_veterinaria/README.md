# Preparación ORM

# Instalación y configuración de Postgresql

## Configuración postgresql

# Instalación y configuración Sequelize

### Prerrequisitos

Tener instalado expressjs

### Por shell

Creación de proyecto node

```jsx
$ npm init -y
```

Instalación de drivers de postgresql

```jsx
$ npm install pg pg-hstore --save
```

Instalación de sequelize

```jsx
$ npm install sequelize --save
```

# Definición de entidades (DML)

### Creación de rol y base de datos por pgadmin

### Cadenas de conexion de postgresql

postgres://user:pass@example.com:5432/dbname

| user | Usuario de la base de datos |
| --- | --- |
| pass | Password de la base de datos |
| example.com | Dominio o IP de la base de datos |
| 5432 | Puerto por defecto de postgresql |
| dbname | Nombre de la base de datos |

### Abrir conexión a bd postgresl

[Getting Started | Sequelize](https://sequelize.org/docs/v6/getting-started/#connecting-to-a-database)

### Creación de entidad

```jsx
import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize("postgres://user:pass@example.com:5432/dbname")

const Mascota = sequelize.define("Mascota", {
    id : {
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey: true
    },
    nombre : DataTypes.STRING,
    edad : DataTypes.INTEGER,
    birthday: {
        type : DataTypes.DATE,
        allowNull : false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

export default Mascota
```

**freezeTableName: true** nos indica que no se debe “pluralizar”.

**timestamps : false** para que no se creen campos de auditoría.

UUID: Representa un identificador único. Más info [https://www.uuidgenerator.net/version4](https://www.uuidgenerator.net/version4)

Mas info de data types: [https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)

## Creación de tablas por PGAdmin

Se creará las tablas por pgadmin directamente en postgresql. Tener cuidado que se siga los parámetros de la entidad.

# Ejercicio 1:

Crear una entidad  en sequelize llamada Tipo que describa los tipos de mascotas que pueden haber (Perro, Gato, Hamster, Loro, etc.). Los campos que deberá tener esta entidad serán:

- nombre : string
- activo : booleano

Luego de crear la entidad en sequelize, crear su respectiva tabla en la base de datos.

# Trabajo con entidades (DDL)

## Prerrequisito

Configurar servidor para recibir peticiones POST por el body.

```jsx
import bodyParser from 'body-parser';

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(bodyParser.raw());
```

## Agregar

Nota: Para agregar data sin necesidad de interfaz gráfica puede utilizar Insomnia REST ([https://insomnia.rest/download](https://insomnia.rest/download))

Un registro

```jsx
app.post("/mascota", async (req, resp)=> {
    const masc = req.body
    console.log(masc)

    const fechaArr = masc.birthday.split("-")
    masc.birthday = new Date(fechaArr[0], parseInt(fechaArr[1]) - 1, fechaArr[2])
    await Mascota.create(masc)

    resp.send("OK")
})
```

- No olvidar de que se parsean las fechas

Varios registros

```jsx
app.post("/mascotas", async (req, resp) => {
    const listaMascotas = req.body

    await Mascota.bulkCreate(listaMascotas.map((masc) => {
        const fechaArr = masc.birthday.split("-")
        masc.birthday = new Date(fechaArr[0], parseInt(fechaArr[1]) - 1, fechaArr[2])
        return masc
    }))

    resp.send("OK")
})
```

## Modificar

```jsx
app.put("/mascota", async(req, resp) => {
    const mascota = req.body

    await Mascota.update(mascota, {
        where : {
            id : mascota.id
        }
    })

    resp.send("OK")
})
```

Tomar en cuenta que el json a enviar tenga la siguiente forma:

```jsx
{
	"id" : "22f22b8a-1cd9-4b01-b51e-d40b821e91f0",
	"nombre" : "Pretinha"
}
```

## Eliminar

```jsx
app.delete("/mascota/:id", async (req, resp) => {
    const mascotaId = req.params.id
    await Mascota.destroy({
        where : {
            id : mascotaId
        }
    })
    resp.send("OK")
})
```

- Utlizando path parameters

## Consultas (con y sin filtros)

Sin filtros

```jsx
app.get("/mascotas", async (req, resp)=> {
    const mascotas = await Mascota.findAll()
    resp.send(mascotas)
})
```

Con filtros

```jsx
app.get("/mascotas", async (req, resp)=> {
    const edad = req.query.edad

    if (edad != undefined) {
        const mascotas = await Mascota.findAll({
            where : {
                edad : edad
            }
        })
        resp.send(mascotas)
    }else {
        const mascotas = await Mascota.findAll()
        resp.send(mascotas)
    }
})
```

- Utilizando query parameters
- Para los filtros puede utilizar operadores [https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators)

# Ejercicio 2:

Crear los endpoint GET, POST, PUT, DELETE para la entidad Tipo.

# Relaciones

## Uno a muchos

Una mascota puede relacionarse con un tipo y un tipo puede relacionarse con varias mascotas.

Se debe crear un nuevo campo (FK) en mascota (idtipo)

![Untitled](Preparacio%CC%81n%20ORM%2039a84f808b2542ed81f791860be12ea6/Untitled.png)

Luego se crea en mascota.js las relaciones:

```jsx
Mascota.belongsTo(Tipo, {
    foreignKey : "idtipo"
})
Tipo.hasMany(Mascota, {
    foreignKey : "id"
})
```

- Tomar en cuenta que el campo del foreignkey es idtipo y está en mascota.

El problema es que solo nos devuelve los códigos de tipo. Si quisiera la información de tipo, tendría que cambiar el endpoint.

```jsx
app.get("/mascotas", async (req, resp)=> {
    const edad = req.query.edad
    
    let mascotas;

    if (edad != undefined) {
        mascotas = await Mascota.findAll({
            where : {
                edad : edad
            }
        })
    }else {
        mascotas = await Mascota.findAll()
    }

    const listaMascotas = []
    for (let mascota of mascotas) {
        listaMascotas.push({
            id: mascota.id,
            nonmbre : mascota.nonmbre,
            edad : mascota.edad,
            tipo : await mascota.getTipo()
        })
    }
    resp.send(listaMascotas)
})
```

## Muchos a muchos

En este caso se deberá crear una tabla intermedia y realizar con cada una la relación de muchos a muchos. La relación muchos a muchos será de Mascota con Vacuna.

# Ejercicio 3:

1. Crear una entidad Veterinario que se relaciona muchos a muchos con Tipo. Esto significa que un veterinario puede especializarse en varios tipos de mascotas y un tipo de mascota puede ser especialidad de varios veterinarios. Los campos son los siguientes:
    - nombre : string
    - activio : booleano
2. Crear la tabla Veterinario así como su tabla intermedia y configurarlo en sequelize.
3. Crear endpoint para veterinario que nos permita ver, además de su nombre, los tipos de animales que se especializa.