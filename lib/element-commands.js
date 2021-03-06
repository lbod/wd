//Element object
//Wrapper around browser methods
var _ = require("./lodash")
  , utils = require("./utils.js")
  , deprecator = utils.deprecator
  , fs = require("fs"),
    callbacks = require("./callbacks"),
    elementCallback = callbacks.elementCallback,
    elementsCallback = callbacks.elementsCallback,
    commands = require('./commands');

var elementCommands = {};

/**
 * element.type(keys, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
elementCommands.type = function (keys, cb) {
  return commands.type.apply(this.browser, [this, keys, cb]);
};

/**
 * element.keys(keys, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
elementCommands.keys = function (keys, cb) {
  return commands.keys.apply(this.browser, [keys, cb]);
};

function _isLocalFile(path, cb) {
  fs.exists(path, function (exists) {
    if(exists) {
      fs.lstat(path, function (err, stats) {
       cb(err, stats.isFile());
      });
    } else { cb(null, false); }
  });
}

/**
 * Equivalent to the python sendKeys binding. Upload file if
 * a local file is detected, otherwise behaves like type.
 * element.sendKeys(keys, cb) -> cb(err)
 */
elementCommands.sendKeys = function (keys, cb) {
  var _this = this;
  if (!(keys instanceof Array)) {keys = [keys];}

  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== "string") {
      keys[idx] = key.toString();
    }
  });

  var path = keys.join('');
  _isLocalFile(path, function (err, isLocalFile) {
    if(err){ return cb(err); }
    if(isLocalFile) {
      commands.uploadFile.apply(_this.browser, [path, function (err, distantFilePath) {
        if(err){ return cb(err); }
        return commands.type.apply(_this.browser, [_this, distantFilePath, cb]);
      }]);
    } else {
      return commands.type.apply(_this.browser, [_this, keys, cb]);
    }
  });
};

/**
 * element.click(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
elementCommands.click = function (cb) {
  return commands.clickElement.apply(this.browser, [this, cb]);
};

/**
 * element.tap(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/touch/click
 */
elementCommands.tap = function (cb) {
  return commands.tapElement.apply(this.browser, [this, cb]);
};

/**
 * element.doubleClick(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/doubleclick
 */
elementCommands.doubleclick = function(cb) {
  return commands.moveTo.apply(this.browser, [this, function(err) {
    if(err) { return cb(err); }
    commands.doubleclick.apply(this.browser, [cb]);
  }.bind(this)]);
};

elementCommands.doubleClick = elementCommands.doubleclick;

/**
 * element.moveTo(xoffset, yoffset, cb) -> cb(err)
 * xoffset and y offset are optional.
 *
 * @jsonWire POST /session/:sessionId/moveto
 */
elementCommands.moveTo = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      xoffset = fargs.all[0],
      yoffset = fargs.all[1];
  return commands.moveTo.apply(this.browser, [this,xoffset, yoffset, cb]);
};

/**
 * element.flick(xoffset, yoffset, speed, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/touch/flick
 */
elementCommands.flick = function (xoffset, yoffset, speed, cb) {
  return commands.flick.apply(this.browser, [this.value, xoffset, yoffset, speed, cb]);
};


/**
 * element.text(cb) -> cb(err, text)
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 2
 */
elementCommands.text = function (cb) {
  return commands.text.apply(this.browser, [this, cb]);
};

/**
 * element.textPresent(searchText, cb) -> cb(err, boolean)
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 4
 */
elementCommands.textPresent = function(searchText, cb) {
  return commands.textPresent.apply(this.browser, [searchText, this, cb]);
};

/**
 * element.getAttribute(attrName, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 2
 */
elementCommands.getAttribute = function(name, cb) {
  return commands.getAttribute.apply(this.browser, [this, name, cb]);
};

/**
 * element.getTagName(cb) -> cb(err, name)
 *
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
elementCommands.getTagName = function(cb) {
  return commands.getTagName.apply(this.browser, [this, cb]);
};

/**
 * element.isDisplayed(cb) -> cb(err, displayed)
 *
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
elementCommands.isDisplayed = function(cb) {
  return commands.isDisplayed.apply(this.browser, [this, cb]);
};

elementCommands.displayed = elementCommands.isDisplayed;

/**
 * element.isSelected(cb) -> cb(err, selected)
 *
 * @jsonWire GET /session/:sessionId/element/:id/selected
 */
elementCommands.isSelected = function(cb) {
  return commands.isSelected.apply(this.browser, [this, cb]);
};

elementCommands.selected = elementCommands.isSelected;

/**
  * element.isEnabled(cb) -> cb(err, enabled)
  *
  * @jsonWire GET /session/:sessionId/element/:id/enabled
  */
elementCommands.isEnabled = function(cb) {
  return commands.isEnabled.apply(this.browser, [this, cb]);
};

elementCommands.enabled = elementCommands.isEnabled;

/**
 * isVisible(cb) -> cb(err, boolean)
 */
elementCommands.isVisible = function(cb) {
  deprecator.warn('element.isVisible', 'element.isVisible has been deprecated, use element.isDisplayed instead.');
  return commands.isVisible.apply(this.browser, [this, cb]);
};

/**
 * element.getLocation(cb) -> cb(err, location)
 *
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
elementCommands.getLocation = function (cb) {
  return commands.getLocation.apply(this.browser, [this, cb]);
};

/**
 * element.getLocationInView(cb) -> cb(err, location)
 *
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
elementCommands.getLocationInView = function (cb) {
  return commands.getLocationInView.apply(this.browser, [this, cb]);
};

/**
 * element.getSize(cb) -> cb(err, size)
 *
 * @jsonWire GET /session/:sessionId/element/:id/size
 */
elementCommands.getSize = function (cb) {
  return commands.getSize.apply(this.browser, [this, cb]);
};

/**
 * element.getValue(cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 4
 */
elementCommands.getValue = function(cb) {
  return commands.getValue.apply(this.browser, [this, cb]);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
elementCommands.getComputedCss = function(styleName, cb) {
  return commands.getComputedCss.apply(this.browser, [this, styleName, cb]);
};

elementCommands.getComputedCSS = elementCommands.getComputedCss;

/**
 * element.clear(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
elementCommands.clear = function(cb) {
  return commands.clear.apply(this.browser, [this, cb]);
};

/**
 * element.submit(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/submit
 */
elementCommands.submit = function(cb) {
  return commands.submit.apply(this.browser, [this, cb]);
};

/**
 * element.getComputedCss(cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
elementCommands.getComputedCss = function(styleName, cb) {
    return commands.getComputedCss.apply(this.browser, [this, styleName, cb]);
};

_.each(utils.elementFuncTypes, function(type) {
  /**
   * element.elementByClassName(value, cb) -> cb(err, element)
   * element.elementByCssSelector(value, cb) -> cb(err, element)
   * element.elementById(value, cb) -> cb(err, element)
   * element.elementByName(value, cb) -> cb(err, element)
   * element.elementByLinkText(value, cb) -> cb(err, element)
   * element.elementByPartialLinkText(value, cb) -> cb(err, element)
   * element.elementByTagName(value, cb) -> cb(err, element)
   * element.elementByXPath(value, cb) -> cb(err, element)
   * element.elementByCss(value, cb) -> cb(err, element)
   * element.elementByIosUIAutomation(value, cb) -> cb(err, element)
   * element.elementByAndroidUIAutomator(value, cb) -> cb(err, element)
   * element.elementByAccessibilityId(value, cb) -> cb(err, element)
   *
   * @jsonWire POST /session/:sessionId/element/:id/element
   * @docOrder 2
   */
  elementCommands['element' + utils.elFuncSuffix(type)] = function(value, cb) {
    elementCommands.element.apply(this, [utils.elFuncFullType(type), value, cb]);
  };

  /**
   * element.elementsByClassName(value, cb) -> cb(err, elements)
   * element.elementsByCssSelector(value, cb) -> cb(err, elements)
   * element.elementsById(value, cb) -> cb(err, elements)
   * element.elementsByName(value, cb) -> cb(err, elements)
   * element.elementsByLinkText(value, cb) -> cb(err, elements)
   * element.elementsByPartialLinkText(value, cb) -> cb(err, elements)
   * element.elementsByTagName(value, cb) -> cb(err, elements)
   * element.elementsByXPath(value, cb) -> cb(err, elements)
   * element.elementsByCss(value, cb) -> cb(err, elements)
   * element.elementsByIosUIAUtomation(value, cb) -> cb(err, elements)
   * element.elementsByAndroidUIAutomator(value, cb) -> cb(err, elements)
   * element.elementsByAccessibilityId(value, cb) -> cb(err, elements)
   *
   * @jsonWire POST /session/:sessionId/element/:id/elements
   * @docOrder 2
   */
  elementCommands['elements' + utils.elFuncSuffix(type)] = function(value, cb) {
    elementCommands.elements.apply(this, [utils.elFuncFullType(type), value, cb]);
  };
});

/**
 * element.element(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/element/:id/element
 * @docOrder 1
 */
elementCommands.element = function(using, value, cb) {
    var _this = this;
    this.browser._jsonWireCall({
      method: 'POST'
      , relPath: '/element/' + _this.value + '/element'
      , data: {using: using, value: value}
      , cb: elementCallback(cb, this.browser)
    });
};

/**
 * element.elements(using, value, cb) -> cb(err, elements)
 *
 * @jsonWire POST /session/:sessionId/element/:id/elements
 * @docOrder 1
 */
elementCommands.elements = function(using, value, cb) {
    var _this = this;
    this.browser._jsonWireCall({
      method: 'POST'
      , relPath: '/element/' + _this.value + '/elements'
      , data: {using: using, value: value}
      , cb: elementsCallback(cb, this.browser)
    });
};

/**
 * element.equals(other, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/equals/:other
 * @docOrder 1
 */
elementCommands.equals = function(other, cb) {
  return commands.equalsElement.apply(this.browser, [this, other, cb]);
};

/**
 * element.sleep(ms, cb) -> cb(err)
 */
elementCommands.sleep = function(ms, cb) {
  cb = cb || function() {};
  setTimeout(cb , ms);
};

/**
 * element.noop(cb) -> cb(err)
 */
elementCommands.noop = function(cb) {
  if(cb) { cb(); }
};

module.exports = elementCommands;
