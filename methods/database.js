/* const mysqlx = require('@mysql/xdevapi')

class MySQL {

    result
    #session

    constructor() {
        this.result = [1, 2, 3, 4]
    }

    async Execute(sql) {
        mysqlx.getSession({
            user: 'root',
            password: 'Woals0313!',
            host: 'localhost',
            port: 33060,
        })
        .then(_session => {
            this.#session = _session
            return this.#session.getSchema('samplebot')
        })
        .then(() => {
            return Promise.all([
                this.#session.sql('USE samplebot').execute()
            ])
        })
        .then(() => {
            return this.#session.sql(sql).execute()
        })
        .then(_result => {
            this.result = _result.fetchAll()
        })
        .then(() => {
            this.#session.close()
        })
        .catch(err => {
            throw err
        })
        console.log(this.result)
        return this.result
    }
} */

const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Woals0313!',
    connectionLimit: 4,
    database: 'samplebot'
})

const sql = 'SELECT * FROM user'
const result = async () => {
    const conn = connection.getConnection()

    try {
        const [row] = await conn.query("SELECT * FROM user")
        return row
    }
    catch(err) {
        throw new Error(err)
    }
    finally {
        conn.release()
    }
}

console.log(result)

module.exports.MySQL = MySQL