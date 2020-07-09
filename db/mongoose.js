const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://<name>:<password>@cluster0.wgq08.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})