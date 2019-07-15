const modelEvents = require('../models/events');
const modelUsersEvents = require('../models/usersevents')
const ErrorExtended = require('../libs/ErrorExtended');

module.exports = class EventsRepo{

    constructor(sequelize){
        this.sequelize = sequelize,
        this.EventsRepo = modelEvents(this.sequelize);
        this.UsersEventsRepo = modelUsersEvents(this.sequelize);
    }

    obtener(query){
        const offset = parseInt(query.page) * parseInt(query.limit)
        const limit = parseInt(query.limit)
        const Op = this.sequelize.Op
        let filtros = {}
        if (query.lat != undefined)
            filtros.latitud = query.lat 
        if (query.lng != undefined)
            filtros.longitud = query.lng 

        query.title == undefined ? query.title = "" : query.title = query.title;
        filtros.title = {[Op.like] : '%' + query.title + '%'}
        return new Promise((resolve, reject)=>
        {
            this.EventsRepo.findAll({
                limit,
                offset,
                where: filtros
            })
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al obtener los eventos' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    guardar(evento){
        return new Promise((resolve, reject)=>
        {
            this.EventsRepo.build({...evento}).save({})
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al crear el evento.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    finduserevent(userevent){
        return new Promise((resolve, reject)=>
        {
            this.UsersEventsRepo.findAll({where:{
                iduser:userevent.iduser,
                idevent:userevent.idevent
            }})
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al obtener las asistencias de los usuarios a los eventos.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    guardaruserevent(userevent){
        return new Promise((resolve, reject)=>
        {
            this.UsersEventsRepo.build({...userevent}).save({})
            .then(result => 
                {
                if(result != null){
                    this.updateattendees(userevent.idevent)
                    resolve(result);
                }
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al crear la asistencia al evento.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    deleteuserevent(userevent){
        return new Promise((resolve, reject)=>
        {
            this.UsersEventsRepo.destroy({where:{
                iduser:userevent.iduser,
                idevent:userevent.idevent
            }})
            .then(result => 
                {
                if(result != null){
                    this.updateattendees(userevent.idevent)
                    resolve(result);
                }
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al borrar la asistencia al evento.' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }
    updateattendees(eventid){
        return new Promise((resolve, reject)=>
        {
            this.UsersEventsRepo.findAll({
                where: {
                    idevent: eventid
                }
            })
            .then(result => 
                {
                if(result != null){
                    this.EventsRepo.update(
                        {
                            attendances:result.length
                        },
                        {
                            where:{
                                id:eventid
                            }
                        }
                    )
                    .then(result => 
                        {
                        if(result != null)
                            resolve("Ok");
                        else    
                            throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al actualizar el evento' });
                        })
                    .catch(err =>
                        {
                            reject(err)
                        })
                }
                    
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al actualizar el evento' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
           
    }
    updateimagename(update){
        return new Promise((resolve, reject)=>
        {
            this.UsersEventsRepo.update({
                image: update.image
            }
            ,{
            where: {
                id: update.id
            }
            })
            .then(result => 
                {
                    if(result != null)
                        resolve(result);
                    else    
                        throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al actualizar el evento' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
           
    }
    buscarimagen(imgname){
        return new Promise((resolve, reject)=>
        {
            this.EventsRepo.findAll({
                where: {
                    image: imgname
                }
            })
            .then(result => 
                {
                if(result != null)
                    resolve(result);
                else    
                    throw new ErrorExtended("Se han detectado algunos errores.", { codigo: 1100, mensaje: 'Error al buscar la imagen' });
                })
            .catch(err =>
                {
                    reject(err)
                })
        });
    }

}