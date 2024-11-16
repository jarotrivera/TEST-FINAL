import React, { useState } from "react";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2"; // Importar el RightPanel2 sin modificar estilos
import Menu from "../components/Menu"; // Importar el componente Menu
import "./VistaHacerUnaVenta.css";

const VistaHacerUnaVenta = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const nuevaVenta = { titulo, descripcion, precio, foto };
      const response = await fetch('https://forogeocentro-production.up.railway.app/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaVenta),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la venta');
      }

      setTitulo('');
      setDescripcion('');
      setPrecio('');
      setFoto(null);
      setMensajeExito('Venta creada con éxito');
    } catch (error) {
      console.error('Error al crear la venta:', error);
    }
  };

  return (
    <div className="vista-hacer-una-venta">
      <div className="sidebar-sticky">
        <Sidebar />
      </div>

      <div className="menu-sticky">
        <Menu />
      </div>

      <div className="content2">
        <section className="main-panel">
          <div className="form-wrapper">
            <div className="form-container">
              <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
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
              {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
            </div>
          </div>
        </section>

        {/* RightPanel2 importado sin que se estire */}
        <div className="right-panel-fixed">
          <RightPanel2 />
        </div>
      </div>
    </div>
  );
};

export default VistaHacerUnaVenta;
