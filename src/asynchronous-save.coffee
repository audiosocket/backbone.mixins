# Asynchronous saving for Backbone models and collection

# Delayed save works as follows:
#  - When @asyncSave is first called, passed attributes are set 
#    immediatly on the model and a new saving task is queued, to 
#    be executed after `saveTimeout`
#  - If @asyncSave is called again while a save task is pending,
#    pending task is canceled an another saving task is queued
#    to be executed after `saveTimeout`
#  - If `@save` is called directly while a saving task is pending,
#    pending task is canceled and saving occurs immediatly.
#  - A `"saving"` event is triggered when a save task is first queued 
#    or when `@save` is called directly without any pending save task.
#  - A `"saving"` event is triggered when saving has successfully 
#    terminated.
#  - The `@saving` function returns `true` if a save is pending or
#    being executed.
#
#  WARNING: Multiple direct calls to `@save` are still possible, as it
#  is with Backbone's Collections. Likewise, a new save task will be
#  queued if @asyncSave is called while a save operation is 
#  hapenning.
#
#  Note: could be merged with asyncSave but this can be tricky..


Backbone.AsynchronousSave = (object) ->
  oldSave = object.save

  _.extend object,
    saveTimeout : 700
    saveTask    : null
    isSaving    : -> @saveTask?

    asyncSave: (attributes, options) ->
      object.set attributes

      if @saveTask?
        clearTimeout @saveTask
        @saveTask = null
        trigger = false
      else
        trigger = true

      fn = =>
        @save null, options
      @saveTask = setTimeout fn, @saveTimeout

      @trigger "saving" if trigger

    save: (attributes, options = {}) ->
      if @saveTask?
        clearTimeout @saveTask
      else
        @trigger "saving"

      # Wrap saveTask status
      self = this
      cb = ->
        self.saveTask = null
        self.trigger "saving"

      success = options.success

      options.success = ->
        cb()
        success.call this, arguments if success?

      error = options.error

      options.error = ->
        cb()
        error.call this, arguments if error?

      oldSave.call object, attributes, options
