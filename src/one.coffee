# Add `one` for registering single-shot event
# trigger.

Backbone.OneEvent =
  one: (ev, callback, context) ->
    self = this
    
    fn = ->
      callback.apply this, arguments
      self.unbind.apply self, [ev, fn]

    this.bind ev, fn, context
