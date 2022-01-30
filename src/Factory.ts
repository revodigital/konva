/*
 * Copyright (c) 2021-2022. Revo Digital 
 * ---
 * Author: gabriele
 * File: Factory.ts
 * Project: pamela 
 * Committed last: 2022/1/26 @ 97
 * ---
 * Description:
 */

import { Util }                  from './Util';
import { getComponentValidator } from './Validators';

/**
 * Prefix for creating getter methods
 */
export const GET = 'get';

/**
 * Prefix for creating setter methods
 */
export const SET = 'set';

/**
 * Contains useful methods for adding getters / setters
 */
export const Factory = {

  /**
   * Adds a getter and a setter for a specific attribute of a class
   * @param constructor Constructor to add to
   * @param attr Attribute to operate on
   * @param def Default value
   * @param validator Validator function
   * @param after Function to execute after value set / get
   */
  addGetterSetter<T>(constructor: any, attr: string, def?: T, validator?, after?) {
    Factory.addGetter(constructor, attr, def);
    Factory.addSetter(constructor, attr, validator, after);
    Factory.addOverloadedGetterSetter(constructor, attr);
  },

  /**
   * Adds a getter for a specific attribute in format 'get<Attr>'
   * @param constructor Class to add to
   * @param attr Attribute
   * @param def Default value
   */
  addGetter(constructor, attr, def?) {
    var method = GET + Util._capitalize(attr);

    constructor.prototype[method] =
      constructor.prototype[method] ||
      function () {
        var val = this.attrs[attr];
        return val === undefined ? def : val;
      };
  },

  /**
   * Adds a setter to a class for a specific attribute
   * @param constructor Constructor class
   * @param attr Attribute to set
   * @param validator validator function
   * @param after
   */
  addSetter<T>(constructor: any, attr: string, validator?: (val: T) => boolean, after?) {
    var method = SET + Util._capitalize(attr);

    if (!constructor.prototype[method]) {
      Factory.overWriteSetter(constructor, attr, validator, after);
    }
  },

  /**
   * Overwrites the setter for a specific attribute
   * @param constructor
   * @param attr
   * @param validator
   * @param after
   */
  overWriteSetter(constructor: any, attr: string, validator?, after?) {
    var method = SET + Util._capitalize(attr);
    constructor.prototype[method] = function (val) {
      if (validator && val !== undefined && val !== null) {
        val = validator.call(this, val, attr);
      }

      this._setAttr(attr, val);

      if (after) {
        after.call(this);
      }

      return this;
    };
  },
  addComponentsGetterSetter(constructor, attr, components, validator?, after?) {
    var len = components.length,
      capitalize = Util._capitalize,
      getter = GET + capitalize(attr),
      setter = SET + capitalize(attr),
      n,
      component;

    // getter
    constructor.prototype[getter] = function () {
      var ret = {};

      for (n = 0; n < len; n++) {
        component = components[n];
        ret[component] = this.getAttr(attr + capitalize(component));
      }

      return ret;
    };

    var basicValidator = getComponentValidator(components);

    // setter
    constructor.prototype[setter] = function (val) {
      var oldVal = this.attrs[attr],
        key;

      if (validator) {
        val = validator.call(this, val);
      }

      if (basicValidator) {
        basicValidator.call(this, val, attr);
      }

      for (key in val) {
        if (!val.hasOwnProperty(key)) {
          continue;
        }
        this._setAttr(attr + capitalize(key), val[key]);
      }

      this._fireChangeEvent(attr, oldVal, val);

      if (after) {
        after.call(this);
      }

      return this;
    };

    Factory.addOverloadedGetterSetter(constructor, attr);
  },
  addOverloadedGetterSetter(constructor, attr) {
    var capitalizedAttr = Util._capitalize(attr),
      setter = SET + capitalizedAttr,
      getter = GET + capitalizedAttr;

    constructor.prototype[attr] = function () {
      // setting
      if (arguments.length) {
        this[setter](arguments[0]);
        return this;
      }
      // getting
      return this[getter]();
    };
  },
  addDeprecatedGetterSetter(constructor, attr, def, validator) {
    Util.error('Adding deprecated ' + attr);

    var method = GET + Util._capitalize(attr);

    var message =
      attr +
      ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
    constructor.prototype[method] = function () {
      Util.error(message);
      var val = this.attrs[attr];
      return val === undefined ? def : val;
    };
    Factory.addSetter(constructor, attr, validator, function () {
      Util.error(message);
    });
    Factory.addOverloadedGetterSetter(constructor, attr);
  },
  backCompat(constructor, methods) {
    Util.each(methods, function (oldMethodName, newMethodName) {
      var method = constructor.prototype[newMethodName];
      var oldGetter = GET + Util._capitalize(oldMethodName);
      var oldSetter = SET + Util._capitalize(oldMethodName);

      function deprecated() {
        method.apply(this, arguments);
        Util.error(
          '"' +
          oldMethodName +
          '" method is deprecated and will be removed soon. Use ""' +
          newMethodName +
          '" instead.'
        );
      }

      constructor.prototype[oldMethodName] = deprecated;
      constructor.prototype[oldGetter] = deprecated;
      constructor.prototype[oldSetter] = deprecated;
    });
  },
  afterSetFilter() {
    this._filterUpToDate = false;
  },
};
