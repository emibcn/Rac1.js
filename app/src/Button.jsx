import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.PureComponent {
  keysString() {
    if ( this.props.keys.length === 0 ) {
      return '';
    }

    // Transform ' ' to 'Space'
    // Transform letters (not texts) to uppercase
    // Uniq with [...new Set()]
    const keys = [
      ...new Set(
        this.props.keys
          .map( key => key === ' ' ? 'Space' : key )
          .map( key => key.length === 1 ?  key.toUpperCase() : key )
      )];
    return ` | Key${ keys.length > 1 ? 's' : '' }: ${ keys.join(', ') }`
  }

  render() {
    const {
      text,
      help,
      icon,
      action,
      keys,
      style,
      className,
      ...restProps
    } = this.props;

    const styleButton = {
      borderRadius: '1em',
      padding: '.7em',
      margin: '1em',
      ...style,
    };

    const helpExtra = help + this.keysString();

    return (
      <button
        onClick={ action }
        aria-label={ helpExtra }
        title={ helpExtra }
        className={ 'rac1-controls-button' + (className ? ` ${className}` : '') }
        style={ styleButton }
        { ...restProps }
      >
        <div style={{
          fontSize: 'calc(1em + 2.5vmin)',
          fontWeight: 'bold',
          minWidth: '1.5em',
        }} >
          { icon instanceof Function ? icon() : icon }
        </div>
        <span style={{
          fontSize: 'calc(8px + 1vmin)',
          color: '#333'
        }}>
          { text instanceof Function ? text() : text }
        </span>
      </button>
    )
  }
};

Button.defaultProps = {
  action: () => {},
  keys: [],
};

Button.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  action: PropTypes.func.isRequired,
  help: PropTypes.string.isRequired,

  // Get keys to let user know how to access the button
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        shiftKey: PropTypes.bool,
        altKey: PropTypes.bool,
        ctrlKey: PropTypes.bool,
        metaKey: PropTypes.bool,
      }),
    ])
  ),
};

class ButtonsGroup extends React.PureComponent {
  render() {
    const { buttons, keyHandlerFocus, children } = this.props;
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        { buttons.map( (control, index) => {
            return <Button
              key={ index }
              onMouseUp={ e => keyHandlerFocus(e, true) }
              action={ control.action.bind(this) }
              help={ control.help }
              text={ control.text }
              icon={ control.icon }
              keys={ control.keys }
            />
          })
        }
        { children }
      </div>
    )
  }
}

ButtonsGroup.defaultProps = {
  keyHandlerFocus: (e, force) => {},
};

ButtonsGroup.propTypes = {
  keyHandlerFocus: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf( PropTypes.shape( Button.propTypes ) )
};

export { Button, ButtonsGroup };
