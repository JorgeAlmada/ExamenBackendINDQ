const Sequelize = require('sequelize');
module.exports = (sequelize)=>{
    const usersevents = sequelize.define('usersevents',{
        iduserevent:{
            type:Sequelize.INTEGER(),
            primaryKey :true,
            autoIncrement :true
        },
        iduser:{
            type:Sequelize.INTEGER(),
        },
        idevent:{
            type:Sequelize.INTEGER()
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
    );
    return usersevents
}