import React, { useState } from "react";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./VistaHacerUnaVenta.css";

const VistaHacerUnaVenta = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para el mensaje de éxito

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando envío de la venta...'); // Log inicial
    try {
      const nuevaVenta = {
        titulo,
        descripcion,
        precio,
        foto,
      };

      // Enviar los datos al backend
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(nuevaVenta),
      });

      if (!response.ok) {
        throw new Error('Error al crear la venta');
      }

      const data = await response.json();
      console.log('Venta creada:', data);

      // Limpiar los campos del formulario y mostrar el mensaje de éxito
      setTitulo('');
      setDescripcion('');
      setPrecio('');
      setFoto(null);
      setMensajeExito('Venta creada con éxito'); // Mensaje de confirmación

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setMensajeExito(''), 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="vista-hacer-una-venta">
      <Sidebar />
      <div className="content2">
        <section className="main-panel">
          <div className="formulario-wrapper">
            <div className="formulario-container">
              <form className="formulario-venta" onSubmit={handleSubmit}>
                <div>
                  <label>Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Precio</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Foto</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {foto && (
                    <div className="photo-preview">
                      <img src={foto} alt="Vista previa" />
                    </div>
                  )}
                </div>
                <button type="submit">Publicar Venta</button>
              </form>
              {/* Mostrar mensaje de éxito */}
              {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
            </div>
          </div>
        </section>
        <RightPanel2 />
      </div>
    </div>
  );
};

export default VistaHacerUnaVenta;

