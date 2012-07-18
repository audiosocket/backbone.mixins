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
      (attributes || (attributes = {})).parent = this;
      child = new kind(attributes, options);
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
      ajaxFetch: false,
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
          this.ajaxFetch = true;
          this.trigger("fetching");
        }
        self = this;
        cb = function() {
          self.ajaxFetch = false;
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

  Backbone.Listenable = {
    listenTo: function(src, event, fn) {
      if (this.bindings == null) {
        this.bindings = [];
      }
      src.bind(event, fn, this);
      this.bindings.push({
        event: event,
        fn: fn,
        src: src
      });
      return this;
    },
    stopListening: function(src) {
      var b, _i, _len, _ref;
      if (this.bindings != null) {
        _ref = this.bindings;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          b = _ref[_i];
          if (!src || b.src === src) {
            b.src.off(b.event, b.fn);
          }
        }
        this.bindings = [];
      }
      return this;
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
