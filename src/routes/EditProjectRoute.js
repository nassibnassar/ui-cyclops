import React from 'react';
import { useHistory } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes/core';
import ProjectForm from '../forms/ProjectForm';

function EditProjectRoute({ resources, mutator, match }) {
  const history = useHistory();

  const handleClose = () => {
    history.push(`../${match.params.projectId}`);
  };

  const handleSubmit = (record) => {
    // The controlled vocabulary only edits fund IDs; the server does not need
    // (and we do not retain) the human-readable `name` of each fund.
    const normalized = {
      ...record,
      funds: (record.funds || []).map(({ id }) => ({ id })),
    };
    mutator.project.PUT(normalized)
      .then(handleClose);
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
  },
  funds: {
    type: 'okapi',
    path: 'cyclops/funds',
  },
});

export default stripesConnect(EditProjectRoute);
