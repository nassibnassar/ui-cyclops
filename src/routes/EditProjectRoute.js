import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { stripesConnect, useCallout } from '@folio/stripes/core';
import ProjectForm from '../forms/ProjectForm';

function EditProjectRoute({ resources, mutator, match }) {
  const history = useHistory();
  const callout = useCallout();

  const handleClose = () => {
    history.push(`../${match.params.projectId}`);
  };

  const handleSubmit = async (record) => {
    // The controlled vocabulary only edits fund IDs; the server does not need
    // (and we do not retain) the human-readable `name` of each fund.
    const normalized = {
      ...record,
      funds: (record.funds || []).map(({ id }) => ({ id })),
    };

    try {
      await mutator.project.PUT(normalized);
      callout.sendCallout({
        message: <FormattedMessage id="ui-cyclops.project.update.success" values={{ name: record.altName }} />,
      });
      handleClose();
    } catch (res) {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: <FormattedMessage
          id="ui-cyclops.project.update.failure"
          values={{
            name: record.altName,
            status: res.status,
            statusText: res.statusText,
            body: await res.text(),
          }}
        />
      });
    }
  };

  const projectResource = resources.project;
  const fundsResource = resources.funds;
  const loaded = (projectResource && projectResource.hasLoaded &&
                  fundsResource && fundsResource.hasLoaded);
  const funds = (fundsResource.records[0] || {}).funds || [];

  return <ProjectForm
    loaded={loaded}
    initialValues={projectResource.records[0]}
    funds={funds}
    onSubmit={handleSubmit}
    onClose={handleClose}
  />;
}

EditProjectRoute.manifest = Object.freeze({
  project: {
    type: 'okapi',
    path: 'cyclops/projects/:{projectId}',
    PUT: {
      throwErrors: false,
    },
  },
  funds: {
    type: 'okapi',
    path: 'cyclops/funds',
  },
});

export default stripesConnect(EditProjectRoute);
