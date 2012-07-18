# A mixin for decorating function calls in a more debuggable way.

Backbone.Decoratable =

  # Register a decorator function that should to be called before
  # `n`. `fn` must take a `finish` callback and call it when the
  # decorator is ready to continue. `fn` will be called in the context
  # of the instance `decorate` is called on. This exists to support
  # multiple asynchronous prerequisites for rendering. It keeps a list
  # instead of blindly wrapping for debuggability.
  #
  # The fact that decorators don't have access to args is not an
  # accident, but I could be persuaded to add it if necessary.

  decorate: (n, fn) ->
    target = this[n]

    unless _.isFunction target
      throw new Error "Can't decorate #{n}, it's not a Function."

    unless target.fns?
      wrap = ->
        args = Array.prototype.slice.call arguments
        fns  = _.clone wrap.fns

        finish = =>
          next = fns.shift()
          if next then next.call this, finish else wrap.old.apply this, args

        finish()

      _.extend wrap, fns: [], old: target
      this[n] = target = wrap

    target.fns.push fn

    this
