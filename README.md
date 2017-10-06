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

Build valid JSON API response. Returns a promise.

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
  });
```

**Response**

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "post",
      "id": 1,
      "attributes": {
        "title": "FOO"
      },
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
      "attributes": {
        "title": "BAR"
      },
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
      "attributes": {
        "title": "FOOBAR"
      },
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
};
```

#### Options

key             | required | type    | description
--------------- | -------- | ------- | -------------------------------------------------------------
`type`          | yes      | string  | Response data type
`data`          | yes      | object  | Response data. _See data structure below_
`relationships` | no       | object  | Data relationship scheme. _See relationships structure below_
`isSingleData`  | no       | boolean | Whether it's a single or multiple data

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

key       | required | type    | description
--------- | -------- | ------- | -------------------------------------------------------
`key`     | yes      | string  | Relationship key from the data
-- `type` | yes      | string  | Relationship type
-- `name` | yes      | string  | Relationship name
-- `isId` | yes      | boolean | Each relationship requires one property to be set as id

**Example**

```javascript
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
  //...
};
```

--------------------------------------------------------------------------------

### error()

Build valid JSON API error response. Returns a promise.

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

**Response**

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

Parse valid JSON API response to flat plain object. Returns a promise.

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
      "id": 1,
      "attributes": {
        "title": "FOO"
      },
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
      "attributes": {
        "title": "BAR"
      },
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
      "attributes": {
        "title": "FOOBAR"
      },
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
};

API.parse(jsonData)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
```

**Response**

```json
{
  "data": [
    {
      "postId": 1,
      "title": "FOO",
      "author": [
        {
          "userId": 10,
          "userEmail": "foo@gmail.com"
        }
      ]
    },
    {
      "postId": 2,
      "title": "BAR",
      "author": [
        {
          "userId": 12,
          "userEmail": "bar@gmail.com"
        }
      ]
    },
    {
      "postId": 3,
      "title": "FOOBAR",
      "author": [
        {
          "userId": 10,
          "userEmail": "foo@gmail.com"
        }
      ]
    }
  ]
}
```
