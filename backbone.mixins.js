// Generated by CoffeeScript 1.3.1
(function() {
  var Backbone, _;

  if (typeof require !== "undefined" && require !== null) {
    Backbone = require("backbone");
    _ = require("underscore");
  } else {
    Backbone = window.Backbone;
    _ = window._;
  }

  Backbone.Ancestry = {
    getChildren: function() {
      var _ref;
      return (_ref = this.children) != null ? _ref : this.children = [];
    },
    getParent: function() {
      var _ref, _ref1;
      return (_ref = this.parent) != null ? _ref : this.parent = (_ref1 = this.options) != null ? _ref1.parent : void 0;
    },
    hasParent: function() {
      return !!this.getParent();
    },
    addChild: function(child) {
      child.parent = this;
      this.getChildren().push(child);
      return child;
    },
    createChild: function(kind, attributes, options) {
      var child;
      child = new kind(attributes, options);
      child.parent = this;
      this.addChild(child);
      return child;
    },
    eachChild: function(fn) {
      return _(this.getChildren()).chain().clone().each(fn);
    },
    removeChild: function(child) {
      this.getChildren().splice(_.indexOf(this.getChildren(), child), 1);
      return child;
    }
  };

  Backbone.AsynchronousFetch = function(object) {
    var oldFetch;
    oldFetch = object.fetch;
    return _.extend(object, {
      fetchTimeout: 700,
      fetchTask: null,
      isFetching: function() {
        return this.fetchTask != null;
      },
      asyncFetch: function(options) {
        var fn, trigger,
          _this = this;
        if (this.fetchTask != null) {
          clearTimeout(this.fetchTask);
          this.fetchTask = null;
          trigger = false;
        } else {
          trigger = true;
        }
        fn = function() {
          return _this.fetch(options);
        };
        this.fetchTask = setTimeout(fn, this.fetchTimeout);
        if (trigger) {
          return this.trigger("fetching");
        }
      },
      fetch: function(options) {
        var cb, error, self, success;
        if (options == null) {
          options = {};
        }
        if (this.fetchTask != null) {
          clearTimeout(this.fetchTask);
        } else {
          this.trigger("fetching");
        }
        self = this;
        cb = function() {
          self.fetchTask = null;
          return self.trigger("fetching");
        };
        success = options.success;
        options.success = function() {
          cb();
          if (success != null) {
            return success.call(this, arguments);
          }
        };
        error = options.error;
        options.error = function() {
          cb();
          if (error != null) {
            return error.call(this, arguments);
          }
        };
        return oldFetch.call(object, options);
      }
    });
  };

  Backbone.AsynchronousSave = function(object) {
    var oldSave;
    oldSave = object.save;
    return _.extend(object, {
      saveTimeout: 700,
      saveTask: null,
      ajaxSave: false,
      asyncSave: function(attributes, options) {
        var fn, trigger,
          _this = this;
        object.set(attributes);
        if (this.saveTask != null) {
          clearTimeout(this.saveTask);
          this.saveTask = null;
          trigger = false;
        } else {
          trigger = true;
        }
        fn = function() {
          return _this.save(null, options);
        };
        this.saveTask = setTimeout(fn, this.saveTimeout);
        if (trigger) {
          return this.trigger("saving");
        }
      },
      save: function(attributes, options) {
        var cb, error, self, success;
        if (options == null) {
          options = {};
        }
        if (this.saveTask != null) {
          clearTimeout(this.saveTask);
        } else {
          this.ajaxSave = true;
          this.trigger("saving");
        }
        self = this;
        cb = function() {
          self.ajaxSave = false;
          self.saveTask = null;
          return self.trigger("saving");
        };
        success = options.success;
        options.success = function() {
          cb();
          if (success != null) {
            return success.call(this, arguments);
          }
        };
        error = options.error;
        options.error = function() {
          cb();
          if (error != null) {
            return error.call(this, arguments);
          }
        };
        return oldSave.call(object, attributes, options);
      }
    });
  };

  Backbone.Decoratable = {
    decorate: function(n, fn) {
      var target, wrap;
      target = this[n];
      if (!_.isFunction(target)) {
        throw new Error("Can't decorate " + n + ", it's not a Function.");
      }
      if (target.fns == null) {
        wrap = function() {
          var args, finish, fns,
            _this = this;
          args = Array.prototype.slice.call(arguments);
          fns = _.clone(wrap.fns);
          finish = function() {
            var next;
            next = fns.shift();
            if (next) {
              return next.call(_this, finish);
            } else {
              return wrap.old.apply(_this, args);
            }
          };
          return finish();
        };
        _.extend(wrap, {
          fns: [],
          old: target
        });
        this[n] = target = wrap;
      }
      target.fns.push(fn);
      return this;
    }
  };

  Backbone.LazyFetch = function(object) {
    var oldFetch;
    oldFetch = object.fetch;
    return _.extend(object, {
      fetch: function(options) {
        var cb, error, success, _base;
        if (options == null) {
          options = {};
        }
        if (!_.isEmpty(object.fetch.callbacks)) {
          return object.fetch.callbacks.push(options);
        }
        success = (options != null ? options.success : void 0) || function() {};
        error = (options != null ? options.error : void 0) || function() {};
        if (object.fetch.fetched) {
          return success(this, this.attributes);
        }
        (_base = object.fetch).callbacks || (_base.callbacks = []);
        object.fetch.callbacks.push({
          success: success,
          error: error
        });
        cb = function(name) {
          return function() {
            var args, callbacks, self;
            callbacks = object.fetch.callbacks;
            object.fetch.callbacks = [];
            self = this;
            args = arguments;
            if (name === "success") {
              object.fetch.fetched = true;
            }
            return _.each(callbacks, function(cb) {
              if ((cb != null ? cb[name] : void 0) != null) {
                return cb[name].apply(self, args);
              }
            });
          };
        };
        options = _.extend(options, {
          success: cb("success"),
          error: cb("error")
        });
        return oldFetch.call(this, options);
      }
    });
  };

  Backbone.Listenable = {
    registerHandler: function(src, event, fn) {
      var handler;
      if (this.bindings == null) {
        this.bindings = [];
      }
      handler = {
        event: event,
        fn: fn,
        src: src
      };
      this.bindings.push(handler);
      return handler;
    },
    removeHandler: function(handler) {
      var pos;
      if (this.bindings == null) {
        this.bindings = [];
      }
      pos = this.bindings.indexOf(handler);
      if (pos === -1) {
        return;
      }
      return this.bindings.splice(pos, 1);
    },
    listenTo: function(src, event, fn) {
      if (this.bindings == null) {
        this.bindings = [];
      }
      src.on(event, fn, this);
      this.registerHandler(src, event, fn);
      return this;
    },
    listenOne: function(src, event, fn) {
      var cb, handler;
      handler = this.registerHandler(src, event, fn);
      cb = function() {
        this.removeHandler(handler);
        return fn.apply(this, arguments);
      };
      src.one(event, cb, this);
      return this;
    },
    stopListening: function(src, event, fn) {
      var b, newBindings, _i, _len, _ref;
      if (this.bindings != null) {
        newBindings = [];
        _ref = this.bindings;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          b = _ref[_i];
          if (!src || b.src === src) {
            if ((!(event != null) || event === b.event) && (!(fn != null) || fn === b.fn)) {
              b.src.off(b.event, b.fn);
            } else {
              newBindings.push(b);
            }
          }
        }
        this.bindings = newBindings;
      }
      return this;
    }
  };

  Backbone.OneEvent = {
    one: function(ev, callback, context) {
      var fn, self;
      self = this;
      fn = function() {
        callback.apply(this, arguments);
        return self.unbind.apply(self, [ev, fn]);
      };
      return this.bind(ev, fn, context);
    }
  };

  Backbone.Tagged = {
    is: function(tag) {
      return _.include(this.get("tags"), tag);
    },
    addTag: function(tag) {
      var tags;
      tags = this.get("tags") || [];
      if (!_.include(tags, tag)) {
        tags.push(tag);
        return this.set({
          tags: tags
        });
      }
    },
    removeTag: function(tag) {
      var tags;
      tags = this.get("tags") || [];
      return this.set({
        tags: _.without(tags, tag)
      });
    }
  };

}).call(this);
