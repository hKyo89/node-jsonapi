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

const jsonMultiRelationships = {
  "jsonapi": {
    "version": "1.0"
  },
  "data": [{
      "type": "subscription",
      "id": "1",
      "attributes": {
        "title": "Premium",
        "description": "This is the description.",
        "permission": 2,
        "chargingBase": 1,
        "maxQty": 12,
        "price": 35000,
        "priceUnit": "bulan",
        "currency": "idr",
        "order": 20,
        "default": true,
        "icon": "https://url/to/icon",
        "enabled": true,
        "baseColor": "#f1c40f",
        "textColor": "#ffffff"
      },
      "relationships": {
        "playlist": {
          "data": [{
              "type": "playlist",
              "id": "PL5"
            },
            {
              "type": "playlist",
              "id": "PL9"
            }
          ]
        },
        "promo": {
          "data": [{
            "type": "promo",
            "id": 1
          }]
        },
        "quality": {
          "data": {
            "type": "quality",
            "id": 1
          }
        }
      }
    },
    {
      "type": "subscription",
      "id": "2",
      "attributes": {
        "title": "HD",
        "description": "This is the description.",
        "permission": 2,
        "chargingBase": 1,
        "maxQty": 12,
        "price": 35000,
        "priceUnit": "bulan",
        "currency": "idr",
        "order": 10,
        "default": true,
        "icon": "https://url/to/icon",
        "enabled": true,
        "baseColor": "#1abc9c",
        "textColor": "#ffffff"
      },
      "relationships": {
        "playlist": {
          "data": [{
              "type": "playlist",
              "id": "PL5"
            },
            {
              "type": "playlist",
              "id": "PL9"
            }
          ]
        },
        "promo": {
          "data": [{
            "type": "promo",
            "id": 1
          }]
        },
        "quality": {
          "data": {
            "type": "quality",
            "id": 2
          }

        }
      }
    },
    {
      "type": "subscription",
      "id": "3",
      "attributes": {
        "title": "Super",
        "description": "This is the description.",
        "permission": 2,
        "chargingBase": 1,
        "maxQty": 12,
        "price": 35000,
        "priceUnit": "bulan",
        "currency": "idr",
        "order": 30,
        "default": true,
        "icon": "https://url/to/icon",
        "enabled": true,
        "baseColor": "#F2101A",
        "textColor": "#ffffff"
      },
      "relationships": {
        "playlist": {
          "data": [{
              "type": "playlist",
              "id": "PL5"
            },
            {
              "type": "playlist",
              "id": "PL9"
            }
          ]
        },
        "promo": {
          "data": [{
            "type": "promo",
            "id": 1
          }]
        },
        "quality": {
          "data": {
            "type": "quality",
            "id": 2
          }

        }
      }
    },
    {
      "type": "subscription",
      "id": "5",
      "attributes": {

        "title": "beIN",
        "description": "This is the description.",
        "permission": 2,
        "chargingBase": 1,
        "maxQty": 12,
        "price": 35000,
        "priceUnit": "bulan",
        "currency": "idr",
        "order": 50,
        "default": true,
        "icon": "https://url/to/icon",
        "enabled": true,
        "baseColor": "#9b59b6",
        "textColor": "#ffffff"
      },
      "relationships": {
        "playlist": {
          "data": [{
              "type": "playlist",
              "id": "PL5"
            },
            {
              "type": "playlist",
              "id": "PL9"
            }
          ]
        },
        "promo": {
          "data": [{
            "type": "promo",
            "id": 1
          }]
        },
        "quality": {
          "data": {
            "type": "quality",
            "id": 2
          }

        }
      }
    }
  ],
  "included": [{
      "type": "playlist",
      "id": "PL9",
      "attributes": {
        "name": "La Liga 2017-2018"
      }
    }, {
      "type": "playlist",
      "id": "PL5",
      "attributes": {
        "name": "La Liga"
      }
    },
    {
      "type": "quality",
      "id": 1,
      "attributes": {
        "name": "SD",
        "width": 1024,
        "height": 576
      }
    },
    {
      "type": "quality",
      "id": 2,
      "attributes": {
        "name": "HD",
        "width": 1280,
        "height": 720
      }
    },
    {
      "type": "playlist",
      "id": 2,
      "attributes": {
        "name": "HD",
        "maxResolution": "720p"
      }
    },
    {
      "type": "promo",
      "id": 1,
      "attributes": {
        "type": "PERCENTOFF",
        "title": "12 Month Disc. 12.5%",
        "amount": 12.5,
        "minQty": 12
      }
    }
  ]
};


// API.build(options)
// API.build(options)
// API.parse(json)
API.parse(jsonMultiRelationships)
// API.error(errors)
  .then((data) => {
  console.log(JSON.stringify(data, null, 2));
}).catch((err) => {
  console.log(err);
});
