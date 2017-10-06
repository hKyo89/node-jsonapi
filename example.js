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

API.build(options)
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.log(err);
  })
