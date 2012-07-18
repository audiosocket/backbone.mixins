# A mixin for tracking outgoing bindings. Use `@listenTo target`
# instead of `target.bind` to track the binding for later removal, and
# use `@stopListening` to remove all outgoing bindings.

Backbone.Listenable =

  # Listen to `event` on `src` with the `fn` callback. `fn` is always
  # called in the context of `this`. Returns `this`.

  listenTo: (src, event, fn) ->
    @bindings ?= []

    src.bind event, fn, this
    @bindings.push event: event, fn: fn, src: src

    this

  # Stop listening to all tracked bindings. Returns `this`.

  stopListening: (src) ->
    if @bindings?
      for b in @bindings when not src or b.src is src
        b.src.off b.event, b.fn

      @bindings = []

    this
