import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import HomeView from '../views/HomeView';

function HomeRoute(props) {
  const projectsResource = props.resources.projects;
  const loaded = projectsResource && projectsResource.hasLoaded;

  return <HomeView
    loaded={loaded}
    projects={projectsResource.records?.[0]}
    deleteProject={(id) => props.mutator.projects.DELETE({ id })}
  />;
}

HomeRoute.manifest = Object.freeze({
  projects: {
    type: 'okapi',
    path: 'cyclops/projects',
    DELETE: {
      throwErrors: false,
    },
  },
});

export default stripesConnect(HomeRoute);
