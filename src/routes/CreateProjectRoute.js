import React from 'react';
import { useHistory } from 'react-router-dom';
import { stripesConnect } from '@folio/stripes/core';
import ProjectForm from '../forms/ProjectForm';

function CreateProjectRoute({ mutator }) {
  const history = useHistory();

  const handleClose = () => {
    history.push('..');
  };

  const handleSubmit = (record) => {
    mutator.project.POST(record)
      .then((newRecord) => history.push(`./${newRecord.altName}`));
  };

  return <ProjectForm
    loaded
    initialValues={{}}
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
});

export default stripesConnect(CreateProjectRoute);
