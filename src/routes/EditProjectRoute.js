import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import ProjectForm from '../forms/ProjectForm';

function EditProjectRoute(props) {
  const projectResource = props.resources.project;
  const loaded = projectResource && projectResource.hasLoaded;

  return <ProjectForm
    loaded={loaded}
    project={projectResource.records[0]}
    putProject={props.mutator.project.PUT}
    sets={{ sets: [] }}
  />;
}

EditProjectRoute.manifest = Object.freeze({
  project: {
    type: 'okapi',
    path: 'cyclops/projects/:{projectId}',
  },
});

export default stripesConnect(EditProjectRoute);
