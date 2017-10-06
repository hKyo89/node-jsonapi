const _ = require('lodash');

class JSONApi {
  constructor(options) {
    options = options || {};
    this.version = options.jsonapi || '1.0';
  }

  build(options) {
    let buildFn = `buildv${this.version.replace(/\./g, '_')}`;
      if (typeof this[buildFn] === 'undefined') {
        return Promise.reject('ERR_JSONAPI_UNSUPPORTED_VERSION');
      }

    return this[buildFn](options);
  }

  _build(row, included, options, reject) {
    let keys = Object.keys(row);
    let _included;
    let relType;
    let relId;

    let data = {
      type: options.type,
    };

    for (let col of keys) {

      if (options.relationships) {
        if (options.relationships[col]) {
          if (typeof data.relationships === 'undefined') {
            data.relationships = {};
          }

          relType = options.relationships[col].type;

          if (typeof relType === 'undefined') {
            return reject('ERR_JSONAPI_MISSING_BUILD_RELATIONSHIP_TYPE');
          }

          let relName = options.relationships[col].name;

          if (typeof data.relationships[relName] === 'undefined') {
            if (options.relationships[col].isId) {
              data.relationships[relName] = { data: {
                type: relType,
                id: row[col],
              } };

              relId = row[col];

              continue;
            }
          }

          if (typeof _included === 'undefined') {
            _included = {};
          }

          _included[col] = row[col];
          continue;
        }
      }

      data[col] = row[col];
    }

    if (_included) {
      if (typeof relId === 'undefined') {
        return reject('ERR_JSONAPI_MISSING_BUILD_RELATIONSHIP_ID');
      }

      if (!_.find(included, { type: relType, id: relId })) {
        included.push({
          type: relType,
          id: relId,
          attributes: _included,
        });
      }
    }

    if (typeof data.id === 'undefined') {
      return reject('ERR_JSONAPI_MISSING_BUILD_DATA_ID');
    }

    return data;
  }

  buildv1_0(options) {
    return new Promise((resolve, reject) => {
      if (typeof options === 'undefined') {
        return reject('ERR_JSONAPI_MISSING_BUILD_OPTIONS');
      }

      if (typeof options.type === 'undefined') {
        return reject('ERR_JSONAPI_MISSING_BUILD_DATA_TYPE');
      }

      if (typeof options.data === 'undefined') {
        return reject('ERR_JSONAPI_MISSING_BUILD_DATA');
      }

      options.isSingleData = options.isSingleData || false;
      let buildData = options.isSingleData ? {} : [];
      let included = [];

      if (options.isSingleData) {
        buildData = this._build(options.data, included, options, reject);
      } else {
        for (let row of options.data) {
          buildData.push(this._build(row, included, options, reject));
        }
      }

      let results = {
        jsonapi: {
          version: this.version,
        },
        data: buildData,
      };

      if (included.length > 0) {
        results.included = included;
      }

      resolve(results);
    });
  }
}

module.exports = JSONApi;
