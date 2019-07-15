class ErrorExtended extends Error {
    constructor(message, args = [{}]) {
      super(message);

      this.name = this.constructor.name;

      this.errores = ( Object.entries(args).length === 0 && args.constructor === Object ) ?  { codigo: 1000, mensaje: 'Error en el proceso.' } : args; 

     
      Error.captureStackTrace(this, this.constructor);
    }
  }

  module.exports = ErrorExtended;