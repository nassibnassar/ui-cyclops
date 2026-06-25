import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import SpectreView from '../views/SpectreView';

function response2spectre(response) {
  if (!response) return undefined;

  const spectre = {};
  response.fields.forEach(({ name }, index) => {
    spectre[name] = response.data[0].values[index];
  });
  return spectre;
}

function SpectreRoute({ resources, mutator, match }) {
  const spectreResource = resources.spectre;
  const fundsResource = resources.funds;
  const loaded = (spectreResource && spectreResource.hasLoaded &&
                  fundsResource && fundsResource.hasLoaded);
  const spectre = response2spectre(spectreResource.records[0]);
  const funds = (fundsResource.records[0] || {}).funds || [];

  return <SpectreView loaded={loaded} match={match} spectre={spectre} funds={funds} mutator={mutator} />;
}

SpectreRoute.manifest = Object.freeze({
  spectre: {
    type: 'okapi',
    path: 'cyclops/sets/:{setId}',
    params: {
      fields: '*',
      cond: (_, pathParams) => `id=${pathParams.spectreId}`,
    },
  },
  spectreUpdate: {
    type: 'okapi',
    path: 'cyclops/sets/:{setId}/:{spectreId}',
    fetch: false,
    clientGeneratePk: false,
    throwErrors: false,
  },
  funds: {
    type: 'okapi',
    path: 'cyclops/funds',
  },
});

export default stripesConnect(SpectreRoute);
