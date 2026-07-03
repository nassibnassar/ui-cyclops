import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalFooter, Select } from '@folio/stripes/components';

const PromptModal = ({
  heading,
  onConfirm,
  onCancel,
  open,
  message,
  filters,
}) => {
  const inputRef = useRef(null);
  // Empty string (not undefined) keeps the Select a controlled component
  const [filter, setFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    if (value) onConfirm(value, filter || undefined);
  };

  const footer = (
    <ModalFooter>
      <Button buttonStyle="primary" onClick={handleSubmit}>
        <FormattedMessage id="stripes-components.submit" />
      </Button>
      <Button buttonStyle="default" onClick={onCancel}>
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      label={heading}
      scope="module"
      size="small"
      footer={footer}
    >
      <p>
        {message}
      </p>
      <div>
        <form onSubmit={handleSubmit}>
          <input style={{ width: '100%', boxSizing: 'border-box' }} name="value" ref={inputRef} type="text" />
          {filters && (
            <Select
              label={<FormattedMessage id="ui-cyclops.prompt.filter.label" />}
              value={filter}
              onChange={e => setFilter(e.target.value)}
              dataOptions={[
                { value: '', label: '' },
                ...filters.map(f => ({ value: f, label: f })),
              ]}
            />
          )}
        </form>
      </div>
    </Modal>
  );
};

export default PromptModal;
