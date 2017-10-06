const JSONApi = require('./index');
const API = new JSONApi();

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

let singleData = {
  id: 1,
  title: 'FOO',
  userId: 10,
  userEmail: 'foo@gmail.com',
};

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

let errors = [{
  status: 400,
  code: 'ERR_API_SET_PROFILE',
  title: 'Failed to set author profile',
  detail: 'Missing author name',
  source: 'profiles.create'
}];

let json = {
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

// API.build(options)
API.parse(json)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
