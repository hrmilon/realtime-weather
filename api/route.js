const route = require("express").Router()
const History = require("./History")

route.get('/', (req, res) => {
  History.find()
    .then((history) => {
      res.status(201).json(history)
    })
    .catch(e => {
      res.status(500).json({ 
        message: "error occurred"
      })
    })
})


route.post('/', (req, res) => {
  let history = new History(req.body)
  history.save()
    .then(() => History.find())
    .then(history => {
      res.status(201).json(history)
    })
    .catch(e => {
      res.status(500).json({
        message: "error occurred"
      })
    })
})

// Export the route object
module.exports = route;