const modelUsers = require('../models/users');
const ErrorExtended = require('../libs/ErrorExtended');

module.exports = class UsersRepo{

    constructor(sequelize){
        this.sequelize = sequelize,
        this.UsersRepo = modelUsers(this.sequelize);
    }

    obtener(user){
        return new Promise((resolve, reject)=>
        {
            this.UsersRepo.findAll({where:{
                email:user.email
            }})
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al obtener el usuario.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    guardar(user){
        return new Promise((resolve, reject)=>
        {
            this.UsersRepo.build({...user}).save({})
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al crear el usuario.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    logincheck(user){
        return new Promise((resolve, reject)=>
        {
            this.UsersRepo.findAll({where:{
                email:user.email,
                password: user.password
            }})
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al iniciar sesión' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }

}