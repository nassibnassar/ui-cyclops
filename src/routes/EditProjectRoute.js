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
    mutator.project.PUT(record)
      .then(handleClose);
  };

  const projectResource = resources.project;
  const loaded = projectResource && projectResource.hasLoaded;

  return <ProjectForm
    loaded={loaded}
    initialValues={projectResource.records[0]}
    onSubmit={handleSubmit}
    onClose={handleClose}
  />;
}

EditProjectRoute.manifest = Object.freeze({
  project: {
    type: 'okapi',
    path: 'cyclops/projects/:{projectId}',
  },
});

export default stripesConnect(EditProjectRoute);
