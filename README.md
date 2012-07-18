backbone.mixins
===============

`backbone.mixins` is a collection of useful mixins for [Backbone](http://backbonejs.org/) applications. Currently, it
contains the following extensions:

* `Backbone.Ancestry` to define hiearchy of objects
* `Backbone.AsynchronousFetch` to turn `Backbone.Model::fetch` into an asynchronous and delayed operation
* `Backbone.Decoratable` to execute callbacks before executing an asynchronous method
* `Backbone.Listenable` to conveniently register and un-register listening callbacks on a `Backbone.Events`-aware object
* `Backbone.Tagged` to manipulate `Backbone.Model` attributes that contain arrays of tags.

Please, refer to each individual code file for more information.

Using
=====

Include `backbone.mixins.js` after including `backbone.js` and before any code that makes 
use of it and you're ready to go!
