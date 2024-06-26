var express = require('express');
var app = express();
var multer = require('multer');
var cors = require('cors');
var axios = require('axios');
app.use(cors());
app.use(express.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/data')
    },
    filename: function (req, file, cb) {
        cb(null, 'data.json')
    }
});

var upload = multer({ storage: storage }).single('file');

app.post('/upload', function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    });
});

app.post('/predict', function(req, res) {
    axios.post('http://localhost:5000/predict', req.body)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});