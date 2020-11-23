const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    console.log('REQ BODY', req.body)

    //extraer el emial y el password del request
    const { email, password } = req.body

    try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' })
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' })
        }

        //Si todo es correcto Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //segundos
        }, (error, token) => {
            if (error) throw error;
            //Mensaje de confirmacion
            res.json({ token })
        })

    } catch (error) {
        console.error(error)
    }
}

//obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error' })
    }
}