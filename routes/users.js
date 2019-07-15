const ErrorExtended = require('../libs/ErrorExtended');
const UsersRepo = require('../Repository/usersRepo');
const validator = require('email-validator')
const jwt = require('jsonwebtoken');

module.exports = app => {

    const objUsersRepo = new UsersRepo(app.db.sequelize);

    app.route('/users')
    .post(async function(req, res, next){
        user = req.body

        if(!user.firstName || !user.lastName || !user.email || !user.password || !user.gender){
            res.status(400).send('Datos invalidos');
        }
        else if(user.firstName == "" || user.lastName == "" || user.email == "" || user.password == "" || user.gender == ""){
            res.status(400).send('Datos invalidos');
        }
        else if(!/^[a-zA-Z]+$/.test(user.firstName) || !/^[a-zA-Z]+$/.test(user.lastName)){
            res.status(400).send('Datos invalidos');
        }
        else if(user.email.substring(user.email.length-4,user.email.length) != ".com"){
            res.status(400).send('Datos invalidos');
        }
        else if(!validator.validate(user.email)){
            res.status(400).send('Datos invalidos');
        }
        else if(user.password.length < 8){
            res.status(400).send('Datos invalidos');
        }
        else {
            try
                {
                    objUsersRepo.obtener({
                        email: user.email
                    })
                    .then(result =>{
                        if(result != null){
                            if(result.length == 0) {
                                try
                                    {
                                        objUsersRepo.guardar({
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            email: user.email,
                                            password: user.password,
                                            gender: user.gender
                                        })
                                        .then(result =>{
                                            if(result != null){
                                                let response = {}
                                                response.id = result.dataValues.id.toString()
                                                res.json(response).send(200);
                                            }
                                                else
                                                    throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al crear un usuario nuevo'});
                                        })
                                        .catch(err =>{
                                            next(err)
                                        });
                                    }
                                    catch(err)
                                    {
                                        next(err);
                                    }
                            } else {   
                                res.status(403).send('La cuenta con ese correo electrónico ya existe');
                            }
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al crear un usuario nuevo'});
                    })
                    .catch(err =>{
                        next(err)
                    });
                }
                catch(err)
                {
                    next(err);
                }
        }
    })
    app.route('/users/login')
    .post(async function(req, res, next){
        user = req.body
            try
                {
                    objUsersRepo.logincheck({
                        email: user.email,
                        password: user.password
                    })
                    .then(result =>{
                        if(result != null){
                            if(result.length == 0){
                                res.status(400).send('Credenciales invalidas');
                            } else {
                                const token = jwt.sign({
                                    email: result[0].dataValues.email,
                                    id: result[0].dataValues.id
                                  }, "tokendeacceso", { expiresIn: "1h" });   
                                
                                let response = {}
                                response.id = result[0].dataValues.id.toString()
                                response.token = token
                                response.firstName = result[0].dataValues.firstName
                                response.lastName = result[0].dataValues.lastName
                                res.json(response).send(200);
                            }
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al querer iniciar sesión'});
                    })
                    .catch(err =>{
                        next(err)
                    });
                }
                catch(err)
                {
                    next(err);
                }
    })
}