if require?
  Backbone = require "backbone"
  _        = require "underscore"
else
  Backbone = window.Backbone
  _        = window._

# Common utility functions for
# things with tags: [..] field

Backbone.Tagged =

  is: (tag) ->
    _.include @get("tags"), tag

  addTag: (tag) ->
    tags = @get("tags") || []
    unless _.include tags, tag
      tags.push tag
      @set tags: tags

  removeTag: (tag) ->
    tags = @get("tags") || []
    @set tags: _.without(tags, tag)
