import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageCurrencySelector = ({ languages, currencies, onClose, onConfirm }) => {
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState('lang'); // "lang" or "currency"
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('lang') || 'fr');
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('currency') || 'XOF');
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleConfirm = () => {
    if (activeTab === 'lang') {
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('lang', selectedLanguage);
    } else {
      const currency = currencies.find((item) => item.code === selectedCurrency);
      localStorage.setItem("currenciData", JSON.stringify(currency));
      localStorage.setItem("currency", selectedCurrency);
    }
    onConfirm(activeTab === 'lang' ? selectedLanguage : selectedCurrency);
    onClose();
    window.location.reload();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Close Button */}
        <button style={styles.closeButton} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Tab Headers */}
        <div style={styles.header}>
          <button
            style={{
              ...styles.tabButton,
              borderBottom: activeTab === 'lang' ? '2px solid #8B5CF6' : 'none',
              color: activeTab === 'lang' ? '#8B5CF6' : '#9CA3AF',
            }}
            onClick={() => setActiveTab('lang')}
          > 
            {t('other.lang')}
          </button>
          <button
            style={{
              ...styles.tabButton,
              borderBottom: activeTab === 'currency' ? '2px solid #8B5CF6' : 'none',
              color: activeTab === 'currency' ? '#8B5CF6' : '#9CA3AF',
            }}
            onClick={() => setActiveTab('currency')}
          >
            {t('other.currency')}
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'lang' ? (
            <div style={styles.optionList}>
              {languages.map((lang) => (
                <label
                  key={lang.code}
                  style={{
                    ...styles.option,
                    backgroundColor: hoveredOption === lang ? '#F9FAFB' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredOption(lang)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <span style={styles.optionLabel}>{lang.name}</span>
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    checked={selectedLanguage === lang.code}
                    onChange={() => {
                      
                      setSelectedLanguage(lang.code)
                    }}
                    style={{
                      ...styles.radioInput,
                      ...(selectedLanguage === lang.code && styles.radioInputChecked),
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <div style={styles.optionList}>
              {currencies.map((currency) => (
                <label
                  key={currency.code}
                  style={{
                    ...styles.option,
                    backgroundColor: hoveredOption === currency.code ? '#F9FAFB' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredOption(currency.code)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <span style={styles.optionLabel}>
                    ({currency.code}) {currency.name}
                  </span>
                  <input
                    type="radio"
                    name="currency"
                    value={currency.code}
                    checked={selectedCurrency === currency.code}
                    onChange={() => setSelectedCurrency(currency.code)}
                    style={{
                      ...styles.radioInput,
                      ...(selectedCurrency === currency.code && styles.radioInputChecked),
                    }}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          style={{
            ...styles.confirmButton,
            backgroundColor: hoveredOption === 'confirm' ? '#7C3AED' : '#8B5CF6',
          }}
          onMouseEnter={() => setHoveredOption('confirm')}
          onMouseLeave={() => setHoveredOption(null)}
          onClick={handleConfirm}
        >
          {t('button.confirm')}
        </button>
      </div>
    </div>
  );
};

export default LanguageCurrencySelector;

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
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    background: '#DAC7FF',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    float: 'right',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  tabButton: {
    flex: 1,
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  content: {
    marginBottom: '20px',
  },
  optionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  option: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #DAC7FF',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  optionLabel: {
    color: '#374151',
    fontSize: '14px',
  },
  radioInput: {
    appearance: 'none',
    width: '20px',
    height: '20px',
    border: '2px solid #D1D5DB',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  radioInputChecked: {
    border: '6px solid #8B5CF6',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
