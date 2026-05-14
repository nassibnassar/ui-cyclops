import React from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Pane, Paneset, Icon, MenuSection, Button, Row, Col, KeyValue } from '@folio/stripes/components';
import { useNav } from '../NavContext';
import { RCKV, CKV } from '../components/CKV';


export default function ProjectForm({ loaded, project }) {
  const nav = useNav();
  nav.update({ project: { ...project, location: useLocation() } });

  const paneTitle = <FormattedMessage id="ui-cyclops.project.edit" values={{ project: nav.project.title }} />;

  const renderActionMenu = () => (
    <MenuSection label="Actions">
      <Button buttonStyle="dropdownItem" to={`${nav.project.altName}/edit`}>
        <Icon size="small" icon="edit">
          Edit
        </Icon>
      </Button>
    </MenuSection>
  );

  return (
    <Paneset static>
      <Pane defaultWidth="20%" paneTitle="">
        {/* Nothing to go here, unless we want an "About" text or something */}
      </Pane>
      <Pane defaultWidth="80%" paneTitle={paneTitle} actionMenu={renderActionMenu}>
        {!loaded
          ? <Icon icon="spinner-ellipsis" />
          : (
            <>
              <Row>
                <CKV rec={project} tag="title" xs={6} />
                <CKV rec={project} tag="altName" xs={3} formatFn={x => <code>{x}</code>} />
                <CKV rec={project} tag="action" xs={3} formatFn={(value) => value.name} />
              </Row>
              <RCKV rec={project} tag="mou_link" formatFn={x => <a target="_blank" rel="noreferrer" href={x}>{x}</a>} />
              <Row>
                <Col xs={6}>
                  XXX maintain list of funds
                </Col>
                <CKV
                  xs={6}
                  rec={project}
                  tag="people"
                  formatFn={
                    x => (
                      <ul>
                        {x?.map(y => <li key={y.name}>{y.name}: {y.role}</li>)}
                      </ul>
                    )
                  }
                />
              </Row>
              <Row>
                <Col xs={6}>
                  <KeyValue label={<FormattedMessage id="ui-cyclops.project.field.locations" />}>
                    <ul>
                      {project.locations?.map(x => <li key={x.name}>{x.name}</li>)}
                    </ul>
                  </KeyValue>
                </Col>
                <Col xs={6}>
                  <KeyValue label={<FormattedMessage id="ui-cyclops.project.field.tracks" />}>
                    <ul>
                      {project.tracks?.map(x => <li key={x.name}>{x.name}</li>)}
                    </ul>
                  </KeyValue>
                </Col>
              </Row>
            </>
          )
        }
      </Pane>
    </Paneset>
  );
}
