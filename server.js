const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
//connects the MongoClient and uploads it to our backend

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbName = 'company_db'
const collName = 'employees'
//since we are going to connect to the same url in multiple parts of
//our application, we save it outside of the functions so every function
//can use the same variables

app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))

app.get('/get-profile', async function (req, res) {
    //connect to Mongo DB
    await client.connect()
    console.log('Connected successfully to server')

    //initiates or gets the database & collection
    const db = client.db(dbName)
    const collection = db.collection(collName)
    
    //get data from the database
    const result = await collection.findOne({id: 1})
    console.log(result)
    client.close()

    response = {}

    if (result !== null) {
        response = {
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }

    res.send (response)
})

app.post('/update-profile', async function(req, res) {
    const payload = req.body
    console.log(payload)

    if(Object.keys(payload).length === 0) {
        res.send({error: "Empty payload. Couldn't update user profile data"})
    } else {
        //updating user profile
        //connect to mongo database
        await client.connect()
        console.log('Connected successfully to database server')

        //initiates or gets the database & collection
        const db = client.db(dbName)
        const collection = db.collection(collName)

        //will create the database if it does not exist
        //afterwards it will get the collection, and create it if it doesn't exist already

        //save payload to the database
        //have to add an id key to the payload to save it to the database
        payload['id'] = 1;
        const updatedValues = { $set: payload }
        await collection.updateOne({id: 1}, updatedValues, {upsert: true});
        client.close()


        res.send({info: "User profile data updated successfully"})
    }
})

app.listen(3000, function() {
    console.log ("app listening on port 3000")
})