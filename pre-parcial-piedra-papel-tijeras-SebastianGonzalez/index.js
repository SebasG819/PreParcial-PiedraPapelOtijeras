//Uso de librerias
import express from 'express';
import cors from 'cors'
import { Server } from 'socket.io';

//Puerto de la aplicacion
const PORT = 5500;

const expressApp = express()
expressApp.use(cors())

//URL del mupi y el control
const httpServer = expressApp.listen(PORT, () => {
    console.table(
        {
            'Player1:': 'http://localhost:5500/player1',
            'Player2:': 'http://localhost:5500/player2',
        })
})

expressApp.use('/player1', express.static('player1-ui'))
expressApp.use('/player2', express.static('player2-ui'))

expressApp.use(express.json())

//Comportamiento del servidor
const io = new Server(httpServer, {
    path: '/real-time',
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

//Iniciar el servidor
io.on('connection', (socket) => {
    console.log('Usuario conectado');


    socket.on('send-point', (p) => {
        io.emit('point-received', p);
    });

    socket.on('send-element1', (elemento) => {
        io.emit('element1-received', elemento);
    });

    socket.on('send-element2', (elemento) => {
        io.emit('element2-received', elemento);
    });

    socket.on('send-time', (t) => {
        io.emit('time-received', t);
    });

    socket.on('disconnected' , () => {
        console.log('un cliente se ha desconectado');

    });
});