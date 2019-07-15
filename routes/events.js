const ErrorExtended = require('../libs/ErrorExtended');
const EventsRepo = require('../Repository/eventsRepo');

module.exports = app => {

    const objEventsRepo = new EventsRepo(app.db.sequelize);

    app.route('/events')
    .post(async function(req, res, next){
        event = req.body
        var today = new Date();
        var eventdate = new Date(event.date)

        if(!event.title || !event.description || !event.date || !event.image || event.location[0] == undefined || event.location[1] == undefined){
            res.status(400).send('Datos invalidos');
        } else if(today > eventdate){
            res.status(400).send('Datos invalidos');
        }
        else {
            try
                {
                    objEventsRepo.guardar({
                        title: event.title,
                        description: event.description,
                        date: event.date,
                        image: event.image,
                        attendances: event.attendances,
                        willYouAttend: event.willYouAttend,
                        longitud: event.location[0],
                        latitud: event.location[1]
                    })
                    .then(result =>{
                        if(result != null){
                            let response = {}
                            response.id = result.dataValues.id.toString()
                            res.json(response).send(200);
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al insertar un evento nuevo'});
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
    app.route('/events')
    .get(async function(req, res, next){
        query = req.query
        if(query.limit == undefined)
            query.limit = 10
            try
                {
                    objEventsRepo.obtener(query)
                    .then(result =>{
                        if(result != null){
                            let response = [{}]
                            response[0].page = query.page
                            response[0].items = result
                            objEventsRepo.obtener({})
                            .then(result => {
                                var pages = result.length / parseInt(query.limit)
                                response[0].pages = Math.ceil(pages)
                                res.json(response).send(200);
                            })
                            .catch(err => {
                                next(err)
                            })
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al obtener los eventos'});
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

    app.route('/events/attendance/:eventId')
    .post(async function(req, res, next){
        let userevent = req.body;
        if(!(Number.isInteger(parseInt(req.params.eventId)))){
            res.status(406).send('ID inválido');
        } else {
        userevent.idevent = req.params.eventId
            try
            {
                objEventsRepo.finduserevent(userevent)
                .then(result =>{
                            
                    if(result != null){
                        if (!(result.length >= 1)){
                            objEventsRepo.guardaruserevent(userevent)
                            .then(result =>{
                                        
                                if(result != null){
                                    res.json(result).send(200);
                                }   
                                    else
                                        throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al guardar la asistencia'});
                            })
                            .catch(err =>{
                                next(err)
                            });
                        } else {
                            res.status(403).send('Evento registrado para asistencia actualmente');
                        }
                    }
                           
                        else
                            throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al guardar la asistencia'});
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
    app.route('/events/attendance/:eventId')
    .delete(async function(req, res, next){
        let userevent = req.body;
        if(!(Number.isInteger(parseInt(req.params.eventId)))){
            res.status(406).send('ID inválido');
        } else {
        userevent.idevent = req.params.eventId
            try
            {
                objEventsRepo.finduserevent(userevent)
                .then(result =>{
                            
                    if(result != null){
                        if (result.length >= 1){
                            objEventsRepo.deleteuserevent(userevent)
                            .then(result =>{
                                        
                                if(result != null){
                                    res.status(200).send('Asistencia eliminada correctamente');
                                }   
                                    else
                                        throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al borrar la asistencia'});
                            })
                            .catch(err =>{
                                next(err)
                            });
                        } else {
                            res.status(403).send('Asistencia no registrada anteriormente');
                        }
                    }
                           
                        else
                            throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al borrar la asistencia'});
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
    

}