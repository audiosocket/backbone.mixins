if require?
  Backbone = require "backbone"
  _        = require "underscore"
else
  Backbone = window.Backbone
  _        = window._

# Asynchronous fetching for Backbone models and collection

# Delayed search works as follows:
#  - When @asyncFetch is first called, a new fetching task
#    is queue, to be executed after `fetchTimeout`
#  - If @asyncFetch is called again while a fetch task is pending,
#    pending task is canceled an another fetching task is queued
#    to be executed after `fetchTimeout`
#  - If `@fetch` is called directly while a fetching task is pending,
#    pending task is canceled and fetching occurs immediatly.
#  - A `"fetching"` event is triggered when a fetch task is first queued 
#    or when `@fetch` is called directly without any pending fetch task.
#  - A `"fetching"` event is triggered when fetching has successfully 
#    terminated.
#  - The `@fetching` function returns `true` if a fetch is pending or
#    being executed.
#
#  WARNING: Multiple direct calls to `@fetch` are still possible, as it
#  is with Backbone's Collections. Likewise, a new fetch task will be
#  queued if @asyncFetch is called while a fetch operation is 
#  hapenning.


Backbone.AsynchronousFetch = (object) ->
  oldFetch = object.fetch

  _.extend object,
    fetchTimeout : 700
    fetchTask    : null
    ajaxFetch    : false

    asyncFetch: (options) ->
      if @fetchTask?
        clearTimeout @fetchTask
        @fetchTask = null
        trigger = false
      else
        trigger = true

      fn = =>
        @fetch options
      @fetchTask = setTimeout fn, @fetchTimeout

      @trigger "fetching" if trigger

    fetch: (options = {}) ->
      if @fetchTask?
        clearTimeout @fetchTask
      else
        @ajaxFetch = true
        @trigger "fetching"

      # Wrap fetchTask status
      self = this
      cb = ->
        self.ajaxFetch = false
        self.fetchTask = null
        self.trigger "fetching"

      success = options.success

      options.success = ->
        cb()
        success.call this, arguments if success?

      error = options.error

      options.error = ->
        cb()
        error.call this, arguments if error?

      oldFetch.call object, options
   
