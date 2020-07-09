const express = require("express")
require("./db/mongoose")

const User = require("./models/users")
const Book = require("./models/bookings")
const Cab = require("./models/cabs")
//
const auth = require("./middleWare/auth")
//
const app = express()
//
app.use(express.json({ extended: true }))
//
app.listen(3000, () => console.log("Server is listning on PORT 3k"))


app.post("/signup", async (req, res) => {
  try {
    const user = await User.createUser(req.body);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.verifyCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (error) {
    res.send(error)
  }
})

app.post("/book_cab", auth, async (req, res) => {
  try {
    const book = await Book.bookCab({ ...req.body, "owner": req.user._id })
    res.send(book)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("/booking_history", auth, async (req, res) => {
  try {
    const booking = await Book.bookingHistory(req.user._id)
    res.send(booking)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/cabs_nearby", auth, async (req, res) => {
  try {
    const cabs = await Cab.nearbyCabs(req.query.currentLoc)
    res.send(cabs)
  } catch (error) {
    res.status(400).send(error)
  }
})