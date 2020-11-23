const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body

        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save()
        res.json({ tarea })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error en el servidor')
    }
}

//Obtiene las tareas por proyetco

exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query

        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto })
        res.json({ tareas })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error en el servidor')
    }
}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body

        //si existe la tarea o no
        let tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No Existe la tarea' })
        }
        const existeProyecto = await Proyecto.findById(proyecto)

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }


        //Crear un objeto con la nueva informacion
        const nuevaTarea = {}
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        //guardar la tarea
        tareaExiste = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true })

        res.json({ tareaExiste })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error en el servidor')
    }
}

//Elimina una tarea 
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query

        //si existe la tarea o no
        let tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No Existe la tarea' })
        }
        const existeProyecto = await Proyecto.findById(proyecto)

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id })
        res.json({ msg: 'Tarea eliminada' })
    } catch (error) {

    }
}