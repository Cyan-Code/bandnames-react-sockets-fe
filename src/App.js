import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { BandAdd } from './components/BandAdd';
import { BandList } from './components/BandList';

const connectSocketServer = () => { // cadena de coneccion
  const socket = io.connect('http://localhost:8080', {
    transports: ['websocket']
  });
  return socket;
}

export const App = () => {

  const [socket] = useState( connectSocketServer )
  const [online, setOnline] = useState(false)
  const [bands, setBands] = useState([])

  useEffect(() => {
    setOnline( socket.connected )
  }, [socket])

  useEffect(() => {
    socket.on('connect', () => {
      setOnline( true )
    })
  }, [socket])
  
  useEffect(() => {
    socket.on('disconnect', () => {
      setOnline( false )
    })
  }, [socket])

  useEffect(() => {
    socket.on('current-bands', (bands) => {
      setBands(bands)
    })
  },[ socket ])

  const votar = (id) => {
    socket.emit('votar-banda', id)
  }
  
  // Borrar bandas
  const borrarBanda = (id) => {
    socket.emit('borrar-banda', id)
  }

  // Cambiar nombre
   const cambiarNombre = (id, nombre) => {   
    socket.emit('cambiar-nombre-banda', {id, nombre})
   }

  return (
    <div className="container">
      <div className="alert">
        <p>
          Service Status:
          {
            online          
             ? <span className="text-success"> OnLine</span>
             : <span className="text-danger"> OffLine</span>
          }          
        </p>
      </div>
      <h1>BandNames</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <BandList
            data = {bands}
            votar = {votar}
            borrar = {borrarBanda}
            cambiarNombre = {cambiarNombre}
          />
        </div>
        <div className="col-4">
          <BandAdd />
        </div>
      </div>
    </div>
  );
}
