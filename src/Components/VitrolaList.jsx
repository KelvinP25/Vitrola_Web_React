import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

const VitrolaList = () => {
  const [music, setMusic] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);
  const handleShowConfirmationModal = (track) => {
    setSelectedTrack(track);
    setShowConfirmationModal(true);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/myapp/music/")
      .then((response) => response.json())
      .then((data) => setMusic(data.music));
  }, []);

  const handleConfirmSendMusic = () => {
    const waitlistData = {
      titulo: selectedTrack.titulo,
      artist: selectedTrack.artist,
      track: selectedTrack.track,
    };

    fetch("http://127.0.0.1:8000/myapp/waitlist/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(waitlistData),
    })
      .then((response) => {
        if (response.ok) {
          alert("La música se ha enviado correctamente a la lista de espera");
        } else {
          alert("Error al enviar la música a la lista de espera");
        }
      })
      .catch((error) => console.error(error));

    handleCloseConfirmationModal();
  };

  return (
    <div className="container py-4 col-6">
      <h1>Lista de Música</h1>
      <hr />
      {music.map((track) => (
        <Card key={track.id} className="mb-3" style={{ width: "18rem", marginLeft: "220px"}} onClick={() => handleShowConfirmationModal(track)}>
          <Card.Body className="text-center">
            <FontAwesomeIcon icon={faMusic} style={{ color: "#731101" }} />
            <Card.Title>{track.titulo}</Card.Title>
            <Card.Text>{track.artist}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush"></ListGroup>
        </Card>
      ))}
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar música a la lista de espera</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres enviar la canción{" "}
          {selectedTrack && selectedTrack.titulo} de{" "}
          {selectedTrack && selectedTrack.artist} a la lista de espera?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmSendMusic}>
            Enviar a la lista de espera
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VitrolaList;