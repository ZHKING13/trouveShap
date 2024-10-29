import React, { useEffect, useState } from 'react';



const CurrencySelector = ({ currencies, onClose, onConfirm }) => {
  const   curency = localStorage.getItem("currency")
    // set currency code in state
    
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem("currency")|| "XOF");
  const [hoveredOption, setHoveredOption] = useState(null);
  

  const handleConfirm = () => {
    onConfirm(selectedCurrency);
      onClose();
      //   refresh the page
      window.location.reload();
  };

  return (
      <div style={styles.overlay}>
          
          <div style={styles.modal}>
                <button 
            style={styles.closeButton}
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        <div style={styles.modalHeader}>
          <div style={styles.headerTitles}>
            <div>
              <h2 style={styles.headerTitle}>Choisir la langue</h2>
              <div style={styles.activeIndicator}></div>
            </div>
           
          </div>
          
        </div>

        <div style={styles.currencyList}>
          {currencies.map((currency) => (
            <label 
              key={currency.code}
              style={{
                ...styles.currencyOption,
                backgroundColor: hoveredOption === currency.code ? '#F9FAFB' : 'transparent'
              }}
              onMouseEnter={() => setHoveredOption(currency.code)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <span style={styles.currencyLabel}>
                ({currency.code}) {currency.name}
              </span>
              <input
                type="radio"
                name="currency"
                value={currency.code}
                checked={selectedCurrency === currency.code}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                style={{
                  ...styles.radioInput,
                  ...(selectedCurrency === currency.code && styles.radioInputChecked)
                }}
              />
            </label>
          ))}
        </div>

        <button 
          style={{
            ...styles.confirmButton,
            backgroundColor: hoveredOption === 'confirm' ? '#7C3AED' : '#8B5CF6'
          }}
          onMouseEnter={() => setHoveredOption('confirm')}
          onMouseLeave={() => setHoveredOption(null)}
          onClick={handleConfirm}
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};

export default CurrencySelector;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
        padding: '0 16px',
    zIndex:1000
  },

  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '400px',
    padding: '24px'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },

  headerTitles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: 500,
    margin: 0
  },

  inactiveTitle: {
    fontSize: '18px',
    fontWeight: 500,
    margin: 0,
    color: '#9CA3AF'
  },

  activeIndicator: {
    height: '2px',
    width: '100px',
    backgroundColor: '#8B5CF6',
    marginTop: '4px'
  },

  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '1px',
      color: '#fff',
      backgroundColor: "#DAC7FF",
      borderRadius: "50%",
      width: "25px",
  },

  currencyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  currencyOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
      borderRadius: '12px',
    border:"1px solid #DAC7FF",
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#F9FAFB'
    }
  },

  currencyLabel: {
    color: '#374151'
  },

  radioInput: {
    appearance: 'none',
    width: '20px',
    height: '20px',
    border: '2px solid #D1D5DB',
    borderRadius: '50%',
    margin: 0,
    cursor: 'pointer',
      position: 'relative',
    
  },

  radioInputChecked: {
    border: '6px solid #8B5CF6'
  },

  confirmButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '24px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};