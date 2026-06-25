import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useCallout } from '@folio/stripes/core';
import { Pane, LoadingPane, IconButton, Row, Col, Headline, KeyValue } from '@folio/stripes/components';
import ActionSection from './ActionSection';
import css from './SpectreView.css';
import packageInfo from '../../package';

function SpectreRoute({ loaded, match, spectre, funds, mutator }) {
  const callout = useCallout();

  if (!loaded) return <LoadingPane />;

  const listUrl = `${packageInfo.stripes.route}/list/${match.params.projectId}/${match.params.setId}`;

  const onChangeFund = async (fund) => {
    try {
      await mutator.spectreUpdate.POST({ decision: true, fund });
      callout.sendCallout({
        message: <FormattedMessage id="ui-cyclops.spectre.set-fund.success" values={{ fund }} />,
      });
    } catch (res) {
      callout.sendCallout({
        type: 'error',
        timeout: 0,
        message: <FormattedMessage
          id="ui-cyclops.spectre.set-fund.failure"
          values={{
            fund,
            status: res.status,
            statusText: res.statusText,
            body: await res.text(),
          }}
        />
      });
    }
  };
  return (
    <Pane
      defaultWidth="40%"
      paneTitle={spectre.title}
      firstMenu={<IconButton icon="times" to={listUrl} />}
    >
      <Row>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">About</Headline>
          <KeyValue label={<FormattedMessage id="ui-cyclops.field.title" />} value={spectre.title} />
          <KeyValue label={<FormattedMessage id="ui-cyclops.field.author" />} value={spectre.author} />
          <KeyValue label={<FormattedMessage id="ui-cyclops.field.full_vendor_name" />} value={spectre.vendor} />
          <KeyValue label={<FormattedMessage id="ui-cyclops.field.availability" />} value={spectre.availability} />
        </Col>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">Media</Headline>
          <i>I have no idea what we can put here.</i>
        </Col>
      </Row>
      <Row>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">Identifiers</Headline>
          <i>Not yet available.</i>
        </Col>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">BISAC categories</Headline>
          <i>Not yet available.</i>
        </Col>
      </Row>
      <Row>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">Review citations</Headline>
          <i>Not yet available.</i>
        </Col>
        <Col xs={6} className={css.miniPane}>
          <Headline tag="h3">Holdings</Headline>
          <i>Not yet available.</i>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className={css.miniPane}>
          <Headline tag="h3">In lists</Headline>
          <i>CCMS does not yet provide a means to discover this.</i>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className={css.miniPane}>
          <Headline tag="h3">Actions</Headline>
          <ActionSection key={match.params.spectreId} spectre={spectre} funds={funds} onChangeFund={onChangeFund} />
        </Col>
      </Row>
    </Pane>
  );
}

export default SpectreRoute;
