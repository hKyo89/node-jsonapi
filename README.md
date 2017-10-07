# node-jsonapi

This library helps you build and parse JSON response using JSON API format.

--------------------------------------------------------------------------------

## Installation

```sh
$ yarn add node-jsonapi
```

--------------------------------------------------------------------------------

## Initialization

```javascript
const JSONApi = require('node-jsonapi');
const API = new JSONApi(options);
```

### Options

key       | required | type   | description
--------- | -------- | ------ | ------------------------------------------------------
`version` | no       | string | JSON API version. Currently only support JSON API v1.0

#### Initialization without options

```javascript
const JSONApi = require('node-jsonapi');
const API = new JSONApi();
```

#### Initialization with options

```javascript
const JSONApi = require('node-jsonapi');
const API = new JSONApi({
  version: '1.0',
});
```

--------------------------------------------------------------------------------

## Methods

- build()
- error()
- parse()

--------------------------------------------------------------------------------

### build()

Build valid JSON API response. Return a promise.

```javascript
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
    author: {
      type: 'user',
      attributes: [ 'userId', 'userEmail' ],
      id: 'userId',
      singular: true,
    },
  },
};

API.build(options)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
```

**Resolved object**

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 10,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 1,
      "attributes": {
        "title": "FOO"
      }
    },
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 12,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 2,
      "attributes": {
        "title": "BAR"
      }
    },
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 10,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 3,
      "attributes": {
        "title": "FOOBAR"
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

key             | required | type    | description
--------------- | -------- | ------- | -------------------------------------------------------------
`type`          | yes      | string  | Response data type
`id`            | no       | string  | Key for data id when id key doesn't exist
`data`          | yes      | object  | Response data. _See data structure below_
`relationships` | no       | object  | Data relationship scheme. _See relationships structure below_
`singular`      | no       | boolean | Whether it's a single or multiple data

#### Data structure

key        | required | type             | description
---------- | -------- | ---------------- | -------------
`id`       | yes      | string or number | Data id
_any keys_ | no       | any              | Any data keys

**Example of single data structure**

```javascript
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

```javascript
let options = {
  //...
  data = [
    { id: 1, title: 'foo' },
    { id: 2, title: 'bar' },
  ],
  //...
};
```

#### Relationships structure _(optional)_

This is the relationship scheme

key           | required | type    | description
------------- | -------- | ------- | -----------------------------------------
`name`        | yes      | string  | Relationship name
/`type`       | yes      | string  | Relationship type
/`id`         | yes      | string  | Relationship id
/`attributes` | yes      | array   | Relationship attributes
/`singular`   | no       | boolean | Whether the relationship data is singular

**Example**

```javascript
let options = {
  //...
  relationships: {
    author: {
      type: 'user',
      attributes: [ 'userId', 'userEmail' ],
      id: 'userId',
      singular: true,
    },
  },
  //...
};
```

--------------------------------------------------------------------------------

### error()

Build valid JSON API error response. Return a promise.

```javascript
const JSONApi = require('node-jsonapi');
const API = new JSONApi();

let errors = [{
  status: 400,
  code: 'ERR_API_SET_PROFILE',
  title: 'Failed to set author profile',
  detail: 'Missing author name',
  source: 'profiles.create'
}];

API.error(errors)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
```

**Resolved object**

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "status": 400,
      "code": "ERR_API_SET_PROFILE",
      "title": "Failed to set author profile",
      "detail": "Missing author name",
      "source": "profiles.create"
    }
  ]
}
```

#### Errors structure

Errors is an Array of error.

**Error**

key      | required | type             | description
-------- | -------- | ---------------- | ------------
`status` | yes      | number           | HTTP status
`code`   | yes      | string or number | Error code
`title`  | no       | string           | Error title
`detail` | no       | string           | Error detail
`source` | no       | string           | Error source

--------------------------------------------------------------------------------

### parse()

Parse valid JSON API response to flat plain object. Return a promise.

```javascript
const JSONApi = require('node-jsonapi');
const API = new JSONApi();

const jsonData = {
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 10,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 1,
      "attributes": {
        "title": "FOO"
      }
    },
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 12,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 2,
      "attributes": {
        "title": "BAR"
      }
    },
    {
      "type": "post",
      "relationships": {
        "author": {
          "data": {
            "id": 10,
            "type": "user"
          },
          "meta": {
            "singular": true
          }
        }
      },
      "id": 3,
      "attributes": {
        "title": "FOOBAR"
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
};

API.parse(jsonData)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
```

**Resolved object**

```json
{
  "data": [
    {
      "author": {
        "userId": 10,
        "userEmail": "foo@gmail.com"
      },
      "postId": 1,
      "title": "FOO"
    },
    {
      "author": {
        "userId": 12,
        "userEmail": "bar@gmail.com"
      },
      "postId": 2,
      "title": "BAR"
    },
    {
      "author": {
        "userId": 10,
        "userEmail": "foo@gmail.com"
      },
      "postId": 3,
      "title": "FOOBAR"
    }
  ]
}
```
