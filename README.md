# djangorest-backbone
This is a library to make possible the use of Django REST Framework with Backbone Framework. There are a lot of libraries that implement this adaptation in the Backend. The objetive of this library is to do this in the Frontend in a simple way.

## Pagination methods

DRF send the pagination data into the request. Djangorest-backbone put this
values in the Collection instance: 

* CollectionInstance.count
* CollectionInstance.next
* CollectionInstance.previous

Also add two methods for pagination:

* CollectionInstance.getPreviousPage
* CollectionInstance.getNextPage

## Using custom Models and Collections

There is a case where maybe a dev doesn't want to overwrite the default Backbone prototype. For this case, there are a custom Model and Collection to be used. It will extend from Backbone.Model / Backbone.Collection and it will be available from Backbone. So, now you can use Backbone.DRF.Model (.Collection) and that's it.

**Important**: Using this implementation won't overwrite the backbone sync method. So, CSRF django token won't be handled by this library.
