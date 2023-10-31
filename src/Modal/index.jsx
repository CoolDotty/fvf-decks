import React from 'react';
import './styles.css';
import Button from '../Button';

function Modal({ isOpen, onCancel, onConfirm }) {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <h2>Clear Deck?</h2>
      <Button onClick={onConfirm} label="Yes" />
      <Button onClick={onCancel} label="CANCEL" />
    </div>
  );
}

export default Modal;
