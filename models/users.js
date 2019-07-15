const Sequelize = require('sequelize');
module.exports = (sequelize)=>{
    const users = sequelize.define('users',{
        id:{
            type:Sequelize.INTEGER(),
            primaryKey :true,
            autoIncrement :true
        },
        firstName:{
            type:Sequelize.STRING
        },
        lastName:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        },
        gender:{
            type:Sequelize.STRING
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
    );
    return users
}