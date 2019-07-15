const ErrorExtended = require('../libs/ErrorExtended');
const EventsRepo = require('../repository/eventsRepo')
const multer = require('multer')


module.exports = app => {

    const objEventsRepo = new EventsRepo(app.db.sequelize);
    const upload = multer({
        dest: "../images"
    })

    var cpUpload = upload.fields([{ name: 'Imagen', maxCount: 1 }]) 

    app.route('/images')
    .post(cpUpload, async function(req, res, next){
        let image = req.body
        image.image = req.files.Imagen[0].originalname
            try
                {
                    objEventsRepo.updateimagename(image)
                    .then(result =>{
                        if(result != null){
                            res.json(result).send(200);
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al insertar la imagen'});
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
    app.route('/images/:filename')
    .get(async function(req, res, next){

        let nombreimagen = req.params.filename
            try
                {
                    objEventsRepo.buscarimagen(nombreimagen)
                    .then(result =>{
                        if(result != null){
                            res.json(result).send(200);
                        }
                            else
                                throw new ErrorExtended("Se han detectado algunos errores.",{codigo:1100,mensaje:'Error al obtener la imagen'});
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