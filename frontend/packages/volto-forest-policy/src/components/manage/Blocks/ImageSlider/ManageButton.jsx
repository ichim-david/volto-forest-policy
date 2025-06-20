import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';

import { Link } from 'react-router-dom';
import { Icon } from '@plone/volto/components';
import penSVG from '@plone/volto/icons/envelope.svg';
import { getBaseUrl } from '@plone/volto/helpers';

class EditSliderButton extends Component {
  render() {
    const path = getBaseUrl(this.props.pathname);
    const provides = this.props.content['@provides'] || [];
    const show = provides.includes(
      'eea.restapi.attachments.interfaces.IHasSliderImages',
    );

    return (
      (__CLIENT__ &&
        show &&
        document.querySelector('.toolbar-actions') &&
        createPortal(
          <Link
            aria-label="Edit Slider"
            className="edit-slider"
            to={`${path}/manage-slider`}
          >
            <Icon name={penSVG} size="30px" className="circled" />
          </Link>,
          document.querySelector('.toolbar-actions'),
        )) ||
      ''
    );
  }
}

export default connect((state, props) => ({
  content: state.content.data,
  pathname: props.pathname,
}))(EditSliderButton);
