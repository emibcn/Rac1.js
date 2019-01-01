import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.PureComponent {
  render() {
    const { text, help, icon, action, ...restProps } = this.props;
    return (
      <button
        onClick={ action }
        aria-label={ help }
        title={ help }
        className='rac1-controls-button'
        style={{
          borderRadius: '1em',
          padding: '.7em',
          margin: '1em',
        }}
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
};

class ButtonsGroup extends React.PureComponent {
  render() {
    const { buttons, keyHandlerFocus } = this.props;
    return (
      <React.Fragment>
        { buttons.map( (control, index) => {
            return <Button
              key={ index }
              onMouseUp={ e => keyHandlerFocus(e, true) }
              action={ control.action.bind(this) }
              help={ control.help }
              text={ control.text }
              icon={ control.icon }
            />
          })
        }
      </React.Fragment>
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
