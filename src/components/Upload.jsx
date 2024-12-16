import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Uploads = ({ handleFileChange }) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const FileChange = (event) => {
     console.log(event)
    const file = event.target.files[0];
    handleFileChange(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  return (
     <div className="file-selector-container">
      <input
        id="file-input"
        type="file"
        onChange={FileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="file-dropzone">
          {previewUrl ? (
          <img style={{
            width:"60%",
            height:"100%"
          }} src={previewUrl} alt="Prévisualisation" className="image-preview" />
        ) : (
          <>
            <div className="icon-container">
              <img
                src="./upload.png"
                alt="icon"
                className="upload-icon"
              />
            </div>
            <p>{t("form.image")} </p>
          </>
        )}
      </label>
      {/* {selectedFile && (
        <div>
          <p>Fichier sélectionné: {selectedFile.name}</p>
        </div>
      )} */}
    </div>
)};
export default Uploads;