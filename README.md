# djangorest-backbone
This is a library to make possible the use of Django REST Framework with Backbone Framework. There are a lot of
libraries that implement this adaptation in the Backend. The objetive of this library is to do this in the
Frond End in a simple way.

## Pagination methods

DRF send the pagination data into the request. Djangorest-backbone put this
values in the Collection instance: 

* CollectionInstance.count
* CollectionInstance.next
* CollectionInstance.previous

Also add two methods for pagination:

* CollectionInstance.getPreviousPage
* CollectionInstance.getNextPage
