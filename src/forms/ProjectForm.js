import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TitleManager } from '@folio/stripes/core';
import { Pane, Paneset, Icon, Row, Col, KeyValue, NoValue, Button, PaneFooter } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { RCKV, CKV } from '../components/CKV';
import { CF } from '../components/CF';


function renderPaneFooter(handleSubmit, onCancel, pristine, submitting) {
  return (
    <PaneFooter
      renderStart={(
        <Button
          buttonStyle="default mega"
          id="clickable-cancel"
          marginBottom0
          onClick={onCancel}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      )}
      renderEnd={(
        <Button
          buttonStyle="primary mega"
          disabled={pristine || submitting}
          id="clickable-update-harvestable"
          marginBottom0
          onClick={handleSubmit}
          type="submit"
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      )}
    />
  );
}


function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-cyclops.fillIn" />;

  ['altName', 'title'].forEach(fieldName => {
    if (!values[fieldName]) {
      errors[fieldName] = requiredTextMessage;
    }
  });

  return errors;
}


function ProjectForm({ loaded, project, initialValues, handleSubmit, onClose, pristine, submitting }) {
  const title = initialValues?.name;
  const paneTitle = <FormattedMessage id="ui-cyclops.project.edit" values={{ project: title }} />;

  return (
    <Paneset static>
      <Pane defaultWidth="20%" paneTitle="">
        {/* Nothing to go here, unless we want an "About" text or something */}
      </Pane>
      <Pane
        defaultWidth="80%"
        paneTitle={paneTitle}
        footer={renderPaneFooter(handleSubmit, onClose, pristine, submitting)}
      >
        {!loaded
          ? <Icon icon="spinner-ellipsis" />
          : (
            <TitleManager record={title}>
              <form>
                <Row>
                  <CF tag="title" xs={6} />
                  <CF tag="altName" xs={3} />
                  <CF tag="action.name" i18nTag="action" xs={3} />
                </Row>
                <RCKV rec={project} tag="mou_link" formatFn={x => <a target="_blank" rel="noreferrer" href={x}>{x}</a>} />
                <Row>
                  <Col xs={6}>
                    <KeyValue label={<FormattedMessage id="ui-cyclops.project.field.funds" />}>
                      <NoValue />
                    </KeyValue>
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
                        {/* project.locations?.map(x => <li key={x.name}>{x.name}</li>) */}
                      </ul>
                    </KeyValue>
                  </Col>
                  <Col xs={6}>
                    <KeyValue label={<FormattedMessage id="ui-cyclops.project.field.tracks" />}>
                      <ul>
                        {/* project.tracks?.map(x => <li key={x.name}>{x.name}</li>) */}
                      </ul>
                    </KeyValue>
                  </Col>
                </Row>
              </form>
            </TitleManager>
          )
        }
      </Pane>
    </Paneset>
  );
}


export default stripesFinalForm({
  // initialValuesEqual: (a, b) => isEqual(a, b),
  validate,
  navigationCheck: true,
  subscription: {
    values: true,
  },
  // mutators: { setFieldData, ...arrayMutators }
})(ProjectForm);
