import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class NewWindow extends React.PureComponent {
  static defaultProps = {
    url: '',
    name: '',
    title: '',
    features: { width: '600px', height: '640px' },
    onBlock: null,
    onOpen: null,
    onUnload: null,
    copyStyles: true,
    closeOnUnmount: true,
    setFeatures: null,
  };
  constructor(props) {
    super(props);
    this.container = null;
    this.window = null;
    this.windowCheckerInterval = null;
    this.released = false;
    this.state = {
      mounted: false,
    };
    this.debouncedSetFeatures = this.debounce(this.setFeatures, 100);
  }

  render() {
    if (!this.state.mounted) return null;
    return ReactDOM.createPortal(this.props.children, this.container);
  }

  componentDidMount() {
    if (!this.window && !this.container) {
      this.openChild();
      this.setState({ mounted: true });
    }
  }

  openChild() {
    const {
      url,
      title,
      name,
      features,
      onBlock,
      onOpen,
      setFeatures,
    } = this.props;

    this.window = window.open(url, name, toWindowFeatures(features));
    this.container = this.window.document.createElement('div');

    this.windowCheckerInterval = setInterval(() => {
      if (!this.window || this.window.closed) {
        this.release();
      }
    }, 50);

    if (this.window) {
      this.window.document.title = title;

      this.container = this.window.document.getElementById(
        'new-window-container',
      );
      if (this.container === null) {
        this.container = this.window.document.createElement('div');
        this.container.setAttribute('id', 'new-window-container');
        this.window.document.body.appendChild(this.container);
      } else {
        const staticContainer = this.window.document.getElementById(
          'new-window-container-static',
        );
        this.window.document.body.removeChild(staticContainer);
      }

      if (this.props.copyStyles) {
        setTimeout(
          () => copyStyles(document, this.window.document),
          0,
        );
      }

      if (typeof onOpen === 'function') {
        onOpen(this.window);
      }

      if (typeof setFeatures === 'function') {
        this.window.addEventListener(
          'resize',
          this.debouncedSetFeatures,
        );
        this.window.addEventListener(
          'move',
          this.debouncedSetFeatures,
        );
      }

      this.window.addEventListener('beforeunload', () =>
        this.release(),
      );
    } else {
      if (typeof onBlock === 'function') {
        onBlock(null);
      } else {
        console.warn(
          'A new window could not be opened. Maybe it was blocked.',
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.state.mounted && this.window) {
      if (this.props.closeOnUnmount) {
        this.window.close();
      } else if (this.props.children) {
        const clone = this.container.cloneNode(true);
        clone.setAttribute('id', 'new-window-container-static');
        this.window.document.body.appendChild(clone);
      }
    }
  }

  release() {
    if (this.released) {
      return;
    }
    this.released = true;

    clearInterval(this.windowCheckerInterval);

    const { onUnload } = this.props;

    if (typeof onUnload === 'function') {
      onUnload(null);
    }
  }
  setFeatures = () => {
    const { setFeatures } = this.props;
    if (typeof setFeatures === 'function') {
      const features = {
        width: this.window.outerWidth,
        height: this.window.outerHeight,
        left: this.window.screenX,
        top: this.window.screenY,
      };
      setFeatures((prevState) => ({ ...prevState, ...features }));
    }
  };

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

NewWindow.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  features: PropTypes.object,
  onUnload: PropTypes.func,
  onBlock: PropTypes.func,
  onOpen: PropTypes.func,
  copyStyles: PropTypes.bool,
  closeOnUnmount: PropTypes.bool,
};

function copyStyles(source, target) {
  const headFrag = target.createDocumentFragment();

  Array.from(source.styleSheets).forEach((styleSheet) => {
    let rules;
    try {
      rules = styleSheet.cssRules;
    } catch (err) {
      console.error(err);
    }

    if (rules) {
      const ruleText = [];

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        const { type } = cssRule;

        if (type === CSSRule.UNKNOWN_RULE) {
          return;
        }

        let returnText = '';

        if (type === CSSRule.KEYFRAMES_RULE) {
          returnText = getKeyFrameText(cssRule);
        } else if (
          [CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)
        ) {
          returnText = fixUrlForRule(cssRule);
        } else {
          returnText = cssRule.cssText;
        }
        ruleText.push(returnText);
      });

      const newStyleEl = target.createElement('style');
      newStyleEl.textContent = ruleText.join('\n');
      headFrag.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      const newLinkEl = target.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      headFrag.appendChild(newLinkEl);
    }
  });

  target.head.appendChild(headFrag);
}

function getKeyFrameText(cssRule) {
  const tokens = ['@keyframes', cssRule.name, '{'];
  Array.from(cssRule.cssRules).forEach((cssRule) => {
    tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}');
  });
  tokens.push('}');
  return tokens.join(' ');
}

function fixUrlForRule(cssRule) {
  return cssRule.cssText
    .split('url(')
    .map((line) => {
      if (line[1] === '/') {
        return `${line.slice(0, 1)}${
          window.location.origin
        }${line.slice(1)}`;
      }
      return line;
    })
    .join('url(');
}

function toWindowFeatures(obj) {
  return Object.keys(obj)
    .reduce((features, name) => {
      const value = obj[name];
      if (typeof value === 'boolean') {
        features.push(`${name}=${value ? 'yes' : 'no'}`);
      } else {
        features.push(`${name}=${value}`);
      }
      return features;
    }, [])
    .join(',');
}

export default NewWindow;