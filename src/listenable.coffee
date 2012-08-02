# A mixin for tracking outgoing bindings. Use `@listenTo target`
# instead of `target.bind` to track the binding for later removal, and
# use `@stopListening` to remove all outgoing bindings.

Backbone.Listenable =
  # Register handler, returns actual registered element.
  registerHandler: (src, event, fn) ->
    @bindings ?= []

    handler = event: event, fn: fn, src: src

    @bindings.push handler

    handler

  # Remove a handler.
  removeHandler: (handler) ->
    @bindings ?= []

    pos = @bindings.indexOf handler
    return if pos == -1

    @bindings.splice pos, 1

  # Listen to `event` on `src` with the `fn` callback. `fn` is always
  # called in the context of `this`. Returns `this`.

  listenTo: (src, event, fn) ->
    @bindings ?= []

    src.on event, fn, this
    @registerHandler src, event, fn

    this

  # This function requires the mixin Backbone.OneEvent on
  # `src`.
  listenOne: (src, event, fn) ->
    handler = @registerHandler src, event, fn
    
    cb = ->
      @removeHandler handler
      fn.apply this, arguments

    src.one event, cb, this

    this

  # Stop listening to all tracked bindings. Returns `this`.

  stopListening: (src) ->
    if @bindings?
      for b in @bindings when not src or b.src is src
        b.src.off b.event, b.fn

      @bindings = []

    this
