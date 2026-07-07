import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

function FundSettings() {
  const stripes = useStripes();
  const intl = useIntl();

  // Connect ControlledVocab exactly once for the lifetime of this component.
  // Connecting during render (e.g. in useMemo keyed on `stripes`) risks
  // rebuilding — and therefore remounting — ControlledVocab if the stripes
  // identity changes, which briefly lets its internal Paneset register as a
  // root paneset and take over the whole screen instead of nesting as the
  // right-hand pane beside the settings nav.
  const connectedRef = useRef(null);
  if (!connectedRef.current) {
    connectedRef.current = stripes.connect(ControlledVocab);
  }
  const ConnectedControlledVocab = connectedRef.current;

  return (
    <ConnectedControlledVocab
      stripes={stripes}
      baseUrl="cyclops/funds"
      records="funds"
      label={intl.formatMessage({ id: 'ui-cyclops.settings.funds' })}
      translations={{
        cannotDeleteTermHeader: 'ui-cyclops.cv.cannotDeleteTermHeader',
        cannotDeleteTermMessage: 'ui-cyclops.cv.cannotDeleteTermMessage',
        deleteEntry: 'ui-cyclops.cv.deleteEntry',
        termDeleted: 'ui-cyclops.cv.termDeleted',
        termWillBeDeleted: 'ui-cyclops.cv.termWillBeDeleted',
      }}
      objectLabel={intl.formatMessage({ id: 'ui-cyclops.settings.funds.objectLabel' })}
      visibleFields={['name', 'title']}
      columnMapping={{
        name: intl.formatMessage({ id: 'ui-cyclops.settings.funds.name' }),
        title: intl.formatMessage({ id: 'ui-cyclops.settings.funds.title' }),
      }}
      id="funds"
      sortby="name"
      hiddenFields={['lastUpdated', 'numberOfObjects']}
    />
  );
}

export default FundSettings;
