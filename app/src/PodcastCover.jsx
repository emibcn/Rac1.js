import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate';
import MediaQuery from 'react-responsive';

class PodcastCover extends PureComponent {
  render() {
    const {
      imageUrl,
      programUrl,
      title,
      author,
      schedule,
      t
    } = this.props;

    return (
      <MediaQuery minWidth={ 1440 }>
        { matches => (
           <article
             style={{
               display: 'flex',
               flexDirection: matches ? 'row' : 'column',
               flexWrap: matches ? 'nowrap' : 'wrap',
               justifyContent: 'center',
               backgroundColor: 'white',
               color: '#777',
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
                   src={ imageUrl }
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
};

PodcastCover.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  programUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  schedule: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default translate('PodcastCover')(PodcastCover);
