import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-translate'

class ButtonLegacy extends React.PureComponent {
  keysString () {
    if (this.props.keys.length === 0) {
      return ''
    }

    // Transform ' ' to 'Space'
    // Transform letters (not texts) to uppercase
    // Uniq with [...new Set()]
    const { t } = this.props
    const keys = [
      ...new Set(
        this.props.keys
          .map((key) => (typeof key === 'string' ? { key } : key))
          .map((key) => (key.key === ' ' ? { ...key, key: 'Space' } : key))
          .map((key) => {
            return {
              ...key,
              key: key.key.length === 1 ? key.key.toUpperCase() : t(key.key)
            }
          })
          .map((key) => (key.shiftKey ? ` ${t('SHIFT')} + ` : '') + key.key)
      )
    ]
    return ` | ${t(`Key${keys.length > 1 ? 's' : ''}`)}: ${keys.join(', ')}`
  }

  render () {
    const {
      text,
      help,
      icon,
      action,
      keys,
      style,
      className,
      t,
      ...restProps
    } = this.props

    const styleButton = {
      borderRadius: '1em',
      padding: '.5em',
      margin: '.5em',
      ...style
    }

    const helpExtra = t(help) + this.keysString()

    return (
      <button
        onClick={action.bind(this, 'Button pressed')}
        aria-label={helpExtra}
        title={helpExtra}
        className={'rac1-controls-button' + (className ? ` ${className}` : '')}
        style={styleButton}
        {...restProps}
      >
        <div
          style={{
            fontSize: 'calc(1em + 2.5vmin)',
            fontWeight: 'bold',
            minWidth: '1.5em'
          }}
        >
          {icon instanceof Function ? icon() : icon}
        </div>
        <span
          style={{
            fontSize: 'calc(8px + 1vmin)',
            color: '#333'
          }}
        >
          {t(text instanceof Function ? text() : text)}
        </span>
      </button>
    )
  }
}

ButtonLegacy.defaultProps = {
  action: () => {},
  keys: []
}

ButtonLegacy.propTypes = {
  text: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
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
        metaKey: PropTypes.bool
      })
    ])
  )
}

class ButtonsGroup extends React.PureComponent {
  keyHandlerFocusForced = (...args) =>
    this.props.keyHandlerFocus(true, ...args)

  render () {
    const { buttons, children } = this.props
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {buttons.map((control, index) => (
          <Button
            key={index}
            onMouseUp={this.keyHandlerFocusForced}
            action={control.action}
            help={control.help}
            text={
              control.text instanceof Function ? control.text() : control.text
            }
            icon={
              control.icon instanceof Function ? control.icon() : control.icon
            }
            keys={control.keys}
          />
        ))}
        {children}
      </div>
    )
  }
}

ButtonsGroup.defaultProps = {
  keyHandlerFocus: (e, force) => {}
}

ButtonsGroup.propTypes = {
  keyHandlerFocus: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape(ButtonLegacy.propTypes))
}

const Button = translate('Button')(ButtonLegacy)
export { Button, ButtonsGroup }
