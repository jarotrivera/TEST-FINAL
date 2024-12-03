import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Menu";
import RightPanel2 from "../components/RightPanel2";
import "./AreasComunes.css";

// Importa las imágenes (versiones miniatura y de alta resolución)
import areaSaludable1Thumb from "../img/thumbnails/areasaludable1_thumb.webp";
import areaSaludable2Thumb from "../img/thumbnails/areasaludable2_thumb.webp";
import areaSaludable3Thumb from "../img/thumbnails/areasaludable3_thumb.webp";
import areasComunitarias1Thumb from "../img/thumbnails/areascomunitarias1_thumb.webp";
import areasComunitarias2Thumb from "../img/thumbnails/areascomunitarias2_thumb.webp";
import areasComunitarias3Thumb from "../img/thumbnails/areascomunitarias3_thumb.webp";
import areaRecreativa1Thumb from "../img/thumbnails/arearecreativa1_thumb.webp";
import areaRecreativa2Thumb from "../img/thumbnails/arearecreativa2_thumb.webp";
import areaRecreativa3Thumb from "../img/thumbnails/arearecreativa3_thumb.webp";

import areaSaludable1 from "../img/areasaludable1.webp";
import areaSaludable2 from "../img/areasaludable2.webp";
import areaSaludable3 from "../img/areasaludable3.webp";
import areasComunitarias1 from "../img/areascomunitarias1.webp";
import areasComunitarias2 from "../img/areascomunitarias2.webp";
import areasComunitarias3 from "../img/areascomunitarias3.webp";
import areaRecreativa1 from "../img/arearecreativa1.webp";
import areaRecreativa2 from "../img/arearecreativa2.webp";
import areaRecreativa3 from "../img/arearecreativa3.webp";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AreasComunes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Datos de las áreas comunes con las imágenes correspondientes
  const areas = [
    {
      nombre: "Áreas Recreativas",
      imagenes: [
        { thumb: areaRecreativa1Thumb, full: areaRecreativa1 },
        { thumb: areaRecreativa2Thumb, full: areaRecreativa2 },
        { thumb: areaRecreativa3Thumb, full: areaRecreativa3 },
      ],
    },
    {
      nombre: "Áreas Saludables",
      imagenes: [
        { thumb: areaSaludable1Thumb, full: areaSaludable1 },
        { thumb: areaSaludable2Thumb, full: areaSaludable2 },
        { thumb: areaSaludable3Thumb, full: areaSaludable3 },
      ],
    },
    {
      nombre: "Áreas Comunitarias",
      imagenes: [
        { thumb: areasComunitarias1Thumb, full: areasComunitarias1 },
        { thumb: areasComunitarias2Thumb, full: areasComunitarias2 },
        { thumb: areasComunitarias3Thumb, full: areasComunitarias3 },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="areas-comunes">
      <div className="layout-container">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          className={isSidebarOpen ? "open" : ""}
        />

        <div className="main-content">
          <div className="amenities">
            {areas.map((area, index) => (
              <div key={index} className="amenity">
                <h3 className="title5">{area.nombre}</h3>
                <div className="image-group">
                  {area.imagenes.map((imagen, imgIndex) => (
                    <div className="image-container" key={imgIndex}>
                      <img
                        src={imagen.thumb}
                        alt={`${area.nombre} ${imgIndex + 1}`}
                        className="area-image"
                        onClick={() => openImageModal(imagen.full)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel-container">
          <RightPanel2 />
        </div>
      </div>

      {/* Modal para mostrar la imagen completa */}
      <Modal open={!!selectedImage} onClose={closeImageModal}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            position: "relative",
          }}
        >
          <IconButton
            onClick={closeImageModal}
            sx={{ position: "absolute", top: "10px", right: "10px", color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Imagen completa"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default AreasComunes;
