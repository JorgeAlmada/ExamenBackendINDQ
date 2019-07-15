const Sequelize = require('sequelize');
module.exports = (sequelize)=>{
    const events = sequelize.define('events',{
        id:{
            type:Sequelize.INTEGER(),
            primaryKey :true,
            autoIncrement :true
        },
        title:{
            type:Sequelize.STRING
        },
        description:{
            type:Sequelize.STRING
        },
        date:{
            type:Sequelize.STRING
        },
        image:{
            type:Sequelize.STRING
        },
        attendances:{
            type:Sequelize.INTEGER()
        },
        willYouAttend:{
            type:Sequelize.BOOLEAN
        },
        longitud:{
            type:Sequelize.FLOAT
        },
        latitud:{
            type:Sequelize.FLOAT
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
    );
    return events
}