import React from 'react';
import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export default class GeneralSettings extends React.Component {
  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <div data-test-application-settings-general-message>
          <FormattedMessage id="ui-cyclops.settings.general.message" />
        </div>
      </Pane>
    );
  }
}
