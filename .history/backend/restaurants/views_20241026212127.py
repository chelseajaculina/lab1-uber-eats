  File "/Users/coachchelseajaculina/miniconda3/lib/python3.11/site-packages/django/contrib/auth/models.py", line 154, in _create_user
    user = self.model(username=username, email=email, **extra_fields)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/coachchelseajaculina/miniconda3/lib/python3.11/site-packages/django/db/models/base.py", line 564, in __init__
    _setattr(self, prop, value)
  File "/Users/coachchelseajaculina/miniconda3/lib/python3.11/site-packages/django/db/models/fields/related_descriptors.py", line 665, in __set__
    raise TypeError(
TypeError: Direct assignment to the forward side of a many-to-many set is prohibited. Use favorites.set() instead.
[27/Oct/2024 04:19:00] "POST /api/customers/signup/ HTTP/1.1" 500 135817
