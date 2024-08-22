const app = require('./main')
const db = require('./config/database')

const PORT = 8000;

db.connect() // db connection

app.listen(PORT, () => {
    console.log('app is listening of port: ', PORT)
})

