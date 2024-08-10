import React from 'react';


const ConfirmationDialog = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <h2 className="dialog-title">Confirmation</h2>
        <p className="dialog-message">
          {message || "Voulez-vous vraiment effectuer cette action? vous pourrez toujours effectuer l’action à nouveau."}
        </p>
        <div className="dialog-buttons">
          <button className="dialog-button cancel-button" onClick={onCancel}>Annuler</button>
          <button className="dialog-button confirm-button" onClick={onConfirm}>Valider</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
