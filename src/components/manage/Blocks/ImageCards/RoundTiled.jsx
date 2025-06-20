import cx from 'classnames';
import { Link } from 'react-router-dom';
import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';
import React, { useEffect } from 'react';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';

export const getPath = (url) => new URL(url).pathname;

// TODO: the approach for the URL path generation is not correct, it does not
// work on local;

// REMOVED thumbUrl as getImageScaleParams will handle this
// export const thumbUrl = (url) =>
//   (url || '').includes(config.settings.apiPath)
//     ? `${flattenToAppURL(url)}/@@images/image/preview`
//     : `${url}/@@images/image/preview`;

export const Card = (props) => {
  const { title, link, attachedimage } = props; // text,
  const image_scale = 'preview'; // Or any other defined scale like 'large', 'tile', etc.
  const scaleParams = getImageScaleParams(attachedimage, image_scale);

  useEffect(() => {
    require('./css/roundtiled.less');
  });

  return (
    <div className="card">
      {link ? (
        <>
          <Link to={link}>
            <img
              src={scaleParams.download}
              alt={title}
              width={scaleParams.width}
              height={scaleParams.height}
            />
          </Link>
          <h5>
            <Link to={link}>{title}</Link>
          </h5>
        </>
      ) : (
        <>
          <img
            src={scaleParams.download}
            alt={title}
            width={scaleParams.width}
            height={scaleParams.height}
          />
          <h5>{title}</h5>
        </>
      )}
    </div>
  );
};

const RoundTiled = ({ data }) => {
  const { title, cards } = data;
  return (
    <div
      className={cx(
        'block align imagecards-block',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <div className="roundtiled">
          <h2>{title}</h2>
          <div className="cards">
            {(cards || []).map((card) => (
              <Card {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTiled;
