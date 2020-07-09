const mongoose = require("mongoose")

const cabSchema = new mongoose.Schema({
    "currentLocation": {
        "type": String,
        "required": true,
        "trim": true
    }, "travellers": [{
        "traveler": {
            "type": mongoose.Schema.Types.ObjectId,
            "required": false,
            "ref": "User"
        }
    }
    ]
}, {
    "timestamps": true
})

const Cab = mongoose.model("Cab", cabSchema)

function createCab(obj) { return Cab(obj).save() }

function nearbyCabs(currentLocation) { return Cab.find({ currentLocation }) }

module.exports = { Cab, nearbyCabs, createCab } 