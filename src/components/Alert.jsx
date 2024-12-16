import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmationDialog = ({ message, onCancel, onConfirm }) => {
  const { t } = useTranslation();
  return (
      <div className="dialog-overlay">
          <div className="dialog-container">
              <h2 className="dialog-title">Confirmation</h2>
              <p className="dialog-message">
                  {message ||
                      "Voulez-vous vraiment effectuer cette action? vous pourrez toujours effectuer l’action à nouveau."}
              </p>
              <div className="dialog-buttons">
                  <button
                      className="dialog-button cancel-button"
                      onClick={onCancel}
                  >
                      {t("button.cancel")}{" "}
                  </button>
                  <button
                      className="dialog-button confirm-button"
                      onClick={onConfirm}
                  >
                      {t("button.confirm")}
                  </button>
              </div>
          </div>
      </div>
  );
};

export default ConfirmationDialog;
