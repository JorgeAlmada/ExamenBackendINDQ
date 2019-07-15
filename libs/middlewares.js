const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");


module.exports = app => {



    app.set('port', process.env.PORT || 1337);
    app.use(express.json());
    app.use(function (req, res, next) {

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,PATCH,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token");

        if (req.method === 'OPTIONS') {
           return res.send(200);
        }

        next();
    });

     app.use((req, res, next) => {
        console.log(req.path == "/users/login")
        if (req.path == "/users/login" || req.path == "/users"){
            next()
        } else {
            const token = req.headers.token;
                if (!token) {
                    return res.sendStatus(401);
                }
                jwt.verify(token, "tokendeacceso", async function (err, decoded) {
                    if (err) {
                        return res.sendStatus(401);
                    }
                    else {
                        next()
                     }
                });
        }


    app.use(bodyParser.urlencoded({ extended: true }));

       });

};