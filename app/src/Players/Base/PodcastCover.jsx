import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate';
import MediaQuery from 'react-responsive';

class PodcastCover extends PureComponent {
  render() {
    const {
      minWidth,
      image,
      programUrl,
      title,
      author,
      schedule,
      t
    } = this.props;

    return (
      <MediaQuery minWidth={ minWidth }>
        { matches => (
           <article
             style={{
               display: 'flex',
               flexDirection: matches ? 'row' : 'column',
               flexWrap: matches ? 'nowrap' : 'wrap',
               justifyContent: 'center',
               backgroundColor: 'white',
               color: '#333',
               padding: '1em',
               borderRadius: '10px',
             }}>
             <header
               style={{
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
             }}>
               <h3>
                 <a href={ programUrl } target='_blank' rel="noopener noreferrer">{ title }</a>
               </h3>
               <div style={{ marginBottom: '.5em' }}>
                 { schedule }
               </div>
               <h4>{ author }</h4>
             </header>
             <div
               style={{
                 alignSelf: 'center',
             }}>
               <figure style={{ position: 'relative' }} aria-label={ `${t("Author")}: ${author}` }>
                 <img
                   src={ image }
                   style={{ width: '100%' }}
                   alt={ `${t("Author")}: ${author}` }
                 />
               </figure>
             </div>
           </article>
        )}
     </MediaQuery>
    );
  }
}

PodcastCover.defaultProps = {
  onClick: (e) => {},
  minWidth: 1440,
};

PodcastCover.propTypes = {
  image: PropTypes.string.isRequired,
  programUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  schedule: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  minWidth: PropTypes.number.isRequired,
};

export default translate('PodcastCover')(PodcastCover);
