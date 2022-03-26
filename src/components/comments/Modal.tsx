import './Modal.css';
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onDelete(): void;
  onCancel(): void;
}

const Modal: React.FC<ModalProps> = ({ onCancel, onDelete }) => {
  return ReactDOM.createPortal(
    <div
      className="modal"
      onClick={() => {
        onCancel();
      }}
    >
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <h3>Delete comment</h3>
        <div className="modal-content">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>
            NO, CANCEL
          </button>
          <button
            className="modal-btn-delete"
            onClick={() => {
              onDelete();
              onCancel();
            }}
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>,
    document.querySelector('#modal') as Element
  );
};

export default Modal;
