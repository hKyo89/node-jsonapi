# node-jsonapi

This library helps you to build and parse JSON response using JSON API format.

## Initialization
``` js
const JSONApi = require('node-jsonapi');
const API = new JSONApi(options);
```

### Options
|key|required|type|description
|---|---|---|---
|`version`|no|string|JSON API version. Currently only support JSON API v1.0

#### Initialization without options
``` js
const JSONApi = require('node-jsonapi');
const API = new JSONApi();
```

#### Initialization without options
``` js
const JSONApi = require('node-jsonapi');
const API = new JSONApi({
  version: '1.0',
});
```

## Methods
- build()

### build()
Build method will return a promise.
``` js
const JSONApi = require('node-jsonapi');
const API = new JSONApi();

// Assuming this is the data from SQL 
let data = [{
  id: 1,
  title: 'FOO',
  userId: 10,
  userEmail: 'foo@gmail.com',
},
{
  id: 2,
  title: 'BAR',
  userId: 12,
  userEmail: 'bar@gmail.com',
},
{
  id: 3,
  title: 'FOOBAR',
  userId: 10,
  userEmail: 'foo@gmail.com',
}];

let options = {
  type: 'post',
  data: data,
  relationships: {
    userId: {
      name: 'author',
      type: 'user',
      isId: true,
    },
    userEmail: {
      name: 'author',
      type: 'user'
    }
  }
};

API.build(options)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  })
```

**Response**
``` json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "post",
      "id": 1,
      "title": "FOO",
      "relationships": {
        "author": {
          "data": {
            "type": "user",
            "id": 10
          }
        }
      }
    },
    {
      "type": "post",
      "id": 2,
      "title": "BAR",
      "relationships": {
        "author": {
          "data": {
            "type": "user",
            "id": 12
          }
        }
      }
    },
    {
      "type": "post",
      "id": 3,
      "title": "FOOBAR",
      "relationships": {
        "author": {
          "data": {
            "type": "user",
            "id": 10
          }
        }
      }
    }
  ],
  "included": [
    {
      "type": "user",
      "id": 10,
      "attributes": {
        "userEmail": "foo@gmail.com"
      }
    },
    {
      "type": "user",
      "id": 12,
      "attributes": {
        "userEmail": "bar@gmail.com"
      }
    }
  ]
}
```

#### Options
|key|required|type|description
|---|---|---|---
|`type`|yes|string|Response data type
|`data`|yes|object|Response data. *See data structure below*
|`relationships`|no|object|Data relationship scheme. *See relationships structure below*
|`isSingleData`|no|boolean|Whether it's a single or multiple data

#### Data structure
|key|required|type|description
|---|---|---|---
|`id`|yes|string or number|Data id
|*any keys*|no|any|Any data keys

**Example of single data structure**
``` js
let options = {
  //...
  data: {
    id: 1,
    title: 'foo',
  },
  //...
};
```

**Example of multiple data structure**
``` js
let options = {
  //...
  data = [
    { id: 1, title: 'foo' },
    { id: 2, title: 'bar' },
  ],
  //...
};
...
```

#### Relationships structure *(optional)*
This is the relationship scheme

|key|required|type|description
|---|---|---|---
|`key`|yes|string|Relationship key from the data
|-- `type`|yes|string|Relationship type
|-- `name`|yes|Relationship name
|-- `isId`|yes|Each relationship requires one property to be set as id

**Example**
``` js
let options = {
  //...
  relationships: {
    userId: {
      type: 'user',
      name: 'author',
      isId: true,
    },
    userEmail: {
      type: 'user',
      name: 'author',
    },
  },
  /...
};
```
