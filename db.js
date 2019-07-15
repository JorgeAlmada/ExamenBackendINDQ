const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

let db = null;

module.exports = app => {

if(!db)
{
    const sequelize = new Sequelize('nombredv', 'username', 'password', {
        dialect: 'mssql',
        dialectOptions: {
        encrypt: true
        },
        host: "database server",
        port: 1433,
        encrypt: true
    });

    db ={
        sequelize,
        Sequelize,
        models: {}
    };
    const dir = path.join( __dirname, 'models');
    console.log(dir);
    
    fs.readdirSync(dir).forEach(filename => {
        const modelDir = path.join(dir, filename);
        const model = sequelize.import(modelDir);
        db.models[model.name] = model;
    });
}
return db;
};