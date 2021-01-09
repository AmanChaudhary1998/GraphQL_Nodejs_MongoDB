const express = require('express');
const bodyParser = require('body-parser');
const graphqLHttp = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphqlResolver = require('./graphql/resolver/index');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())

app.use('/graphql',graphqLHttp({
    schema: graphQlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mycluster.o3hq5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is connected at http://localhost:${PORT}/graphql`);
    })
}).catch((err)=>{
    console.log(err)
})