if require?
  Backbone = require "backbone"
  _        = require "underscore"
else
  Backbone = window.Backbone
  _        = window._

# A mixin for objects with parent/child relationships.

Backbone.Ancestry =
  getChildren: ->
    @children ?= []

  # Get this instance's parent. Both `this.parent` and
  # `this.options.parent` are checked if they exist.

  getParent: ->
    @parent ?= @options?.parent

  # Does this instance have a parent?

  hasParent: ->
    not not @getParent()

  # Add a `child` instance. Sets the child's `parent` to
  # `this`. Returns `child`.

  addChild: (child) ->
    child.parent = this
    @getChildren().push child
    child

  # Create a new instance of `kind` and add it as a child, passing
  # along `attributes` and `options` to the constructor.
  # Returns the new instance.

  createChild: (kind, attributes, options) ->
    (attributes ||= {}).parent = this
    child = new kind attributes, options
    @addChild child
    child

  # Safely iterate over each child even if they're removed during
  # iteration. Returns `this`.

  eachChild: (fn) ->
    _(@getChildren()).chain().clone().each fn

  # Remove `child` from this instance's list of children. Returns
  # `child`.

  removeChild: (child) ->
    @getChildren().splice _.indexOf(@getChildren(), child), 1
    child
