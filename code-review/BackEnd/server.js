require('dotenv').config()
const app = require('./src/app')



app.listen(3000, () => {
    console.log('Server is running on 3000')
})