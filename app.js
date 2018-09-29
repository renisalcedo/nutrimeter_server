const app = require('./src/server.js')

const port = 5000

app.listen(port, () => {
  console.log(`Api Running on ${port}`)
})
