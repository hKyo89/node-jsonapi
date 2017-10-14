const JSONApi = require('./index');
const API = new JSONApi();

let dataSequelize = [
  {
    postId: 1,
    title: 'FOO',
    author: [
      {
        id: 20,
        userEmail: 'foo@gmail.com'
      }, {
        id: 21,
        userEmail: 'foo@gmail.com'
      }
    ]
  }, {
    postId: 2,
    title: 'BAR',
    author: {
      id: 12,
      userEmail: 'bar@gmail.com'
    }
  }, {
    postId: 3,
    title: 'FOOBAR',
    author: {
      id: 10,
      userEmail: 'foo@gmail.com'
    }
  }
];

let data = [
  {
    postId: 1,
    title: 'FOO',
    userId: 10,
    userEmail: 'foo@gmail.com'
  }, {
    postId: 2,
    title: 'BAR',
    userId: 12,
    userEmail: 'bar@gmail.com'
  }, {
    postId: 3,
    title: 'FOOBAR',
    userId: 10,
    userEmail: 'foo@gmail.com'
  }
];

let singleData = {
  postId: 1,
  title: 'FOO',
  userId: 10,
  userEmail: 'foo@gmail.com'
};

let options = {
  type: 'post',
  id: 'postId',
  data: dataSequelize,
  relationships: {
    author: {
      type: 'user',
      // attributes: [
      //   'userId', 'userEmail'
      // ],
      // id: 'userId',
      object: true,
      // singular: true
    }
  }
};

let errors = [
  {
    status: 400,
    code: 'ERR_API_SET_PROFILE',
    // title: 'Failed to set author profile',
    // detail: 'Missing author name',
    // source: 'profiles.create'
  }
];

let json = {
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
    }, {
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
    }, {
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
    }, {
      "type": "user",
      "id": 12,
      "attributes": {
        "userEmail": "bar@gmail.com"
      }
    }
  ]
};

// API.build(options)
// API.build(options)
API.parse(json)
// API.error(errors)
  .then((data) => {
  console.log(JSON.stringify(data, null, 2));
}).catch((err) => {
  console.log(err);
});
