Backbone.LazyFetch = (object) ->
  oldFetch = object.fetch

  _.extend object,
    fetch: (options = {}) ->
      return object.fetch.callbacks.push options unless _.isEmpty(object.fetch.callbacks)

      success = options?.success || ->
      error   = options?.error   || ->

      return success this, this.attributes if object.fetch.fetched

      object.fetch.callbacks ||= []
      object.fetch.callbacks.push
        success: success
        error:   error

      cb = (name) ->
        ->
          callbacks = object.fetch.callbacks
          object.fetch.callbacks = []

          self = this
          args = arguments

          object.fetch.fetched = true if name == "success"

          _.each callbacks, (cb) ->
            cb[name].apply self, args if cb?[name]?

      options = _.extend options,
        success: cb("success")
        error:   cb("error")

      oldFetch.call this, options

