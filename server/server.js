const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

let app = express();


app.use(express.static(publicPath));

//ddd


app.listen(port , () => {
    console.log(`Server start on port ${port}.`)
}); 