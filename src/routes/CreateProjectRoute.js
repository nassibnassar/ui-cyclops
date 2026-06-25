import React from 'react';
import { useHistory } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes/core';
import ProjectForm from '../forms/ProjectForm';

function CreateProjectRoute({ resources, mutator }) {
  const history = useHistory();

  const handleClose = () => {
    history.push('..');
  };

  const handleSubmit = (record) => {
    // The controlled vocabulary only edits fund IDs; the server does not need
    // (and we do not retain) the human-readable `name` of each fund.
    const normalized = {
      ...record,
      funds: (record.funds || []).map(({ id }) => ({ id })),
    };
    mutator.project.POST(normalized)
      .then((newRecord) => history.push(`./${newRecord.altName}`));
  };

  const fundsResource = resources.funds;
  const loaded = fundsResource && fundsResource.hasLoaded;
  const funds = (fundsResource.records[0] || {}).funds || [];

  return <ProjectForm
    loaded={loaded}
    initialValues={{}}
    funds={funds}
    onSubmit={handleSubmit}
    onClose={handleClose}
  />;
}

CreateProjectRoute.manifest = Object.freeze({
  project: {
    type: 'okapi',
    path: 'cyclops/projects',
    fetch: false,
    POST: {
      throwErrors: false,
    },
  },
  funds: {
    type: 'okapi',
    path: 'cyclops/funds',
  },
});

export default stripesConnect(CreateProjectRoute);
