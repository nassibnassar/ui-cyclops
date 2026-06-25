import React, { useMemo } from 'react';
import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import ListView from '../views/ListView';

const INITIAL_RESULT_COUNT = 20;
const RESULT_COUNT_INCREMENT = 20;

function ListRoute({ stripes, resources, mutator, children, location, match }) {
  const source = useMemo(() => {
    return new StripesConnectedSource({ resources, mutator }, stripes.logger, 'spectres');
  }, [resources, mutator, stripes.logger]);

  const handleNeedMoreData = (_askAmount, index) => {
    source.fetchOffset(index);
  };

  const query = new URLSearchParams(location.search);
  const addFrom = query.get('addFrom');
  const spectresResource = resources.spectres;
  const loaded = spectresResource && spectresResource.hasLoaded;

  return (
    <ListView
      loaded={loaded}
      name={match.params.setId}
      spectres={spectresResource.records[0]}
      spectreCount={resources.spectreCount.records[0]?.data[0].values[0]}
      query={resources.query}
      updateQuery={mutator.query.update}
      addFrom={addFrom}
      addSpectre={(spectreId) => mutator.addToList.POST({ from: addFrom, cond: `id = ${spectreId}` })}
      pageAmount={RESULT_COUNT_INCREMENT}
      onNeedMoreData={handleNeedMoreData}
      pagingOffset={resources.resultOffset}
      XXX_error_so_we_can_handle_errors_politely={undefined}
    >
      {children}
    </ListView>
  );
}

// Used as a query-parameter function in two manifest entries
function condFn(_a, _b, resources) {
  const clauses = [];

  const query = resources.query.query;
  const qindex = resources.query.qindex;
  if (query && qindex) {
    if (qindex === 'title' || qindex === 'author' || qindex === 'author' || qindex === 'full_vendor_name') {
      clauses.push(`${qindex} ilike '%${query}%'`);
    } else {
      clauses.push(`${qindex} = '${query}'`);
    }
  }

  const availability = resources.query.availability;
  if (availability) {
    clauses.push(`availability = '${availability}'`);
  }

  return clauses.join(' and ');
}

ListRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  spectres: {
    type: 'okapi',
    path: (queryParams, pathParams) => {
      // console.log('queryParams =', queryParams, '-- pathParams =', pathParams);
      return `cyclops/sets/${queryParams.addFrom || pathParams.setId}`;
    },
    params: {
      fields: '*',
      cond: condFn,
      sort: (_a, _b, resources) => {
        const s = resources.query.sort;
        if (!s) {
          return 'id'; // CCMS requires an explicit sort-order in order to do paging
        } else if (s.startsWith('-')) {
          return s.replace('-', '') + ' desc';
        } else {
          return s;
        }
      },
      offset: '%{resultOffset}',
      limit: `${RESULT_COUNT_INCREMENT}`,
      // XXX The following are not yet supported by CCMS
      // filter: 'jurassic',
      // tag: 'dino,ptero',
    },
  },
  spectreCount: {
    type: 'okapi',
    path: (queryParams, pathParams) => {
      // Same path-function as for the main 'spectres' manifest entry
      return `cyclops/sets/${queryParams.addFrom || pathParams.setId}`;
    },
    params: {
      countOnly: true,
      cond: condFn,
    },
  },
  addToList: {
    type: 'okapi',
    path: 'cyclops/sets/:{setId}/add',
    fetch: false,
    throwErrors: false,
  }
});

export default stripesConnect(ListRoute);
