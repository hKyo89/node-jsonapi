const _ = require('lodash');

class JSONApi {
  constructor(options) {
    options = options || {};
    this.version = options.jsonapi || '1.0';
  }

  _fn(fnName, options) {
    let fn = `${fnName}v${this.version.replace(/\./g, '_')}`;
    if (typeof this[fn] === 'undefined') {
      return Promise.reject('ERR_JSONAPI_UNSUPPORTED_VERSION');
    }

    return this[fn](options);
  }

  build(options) {
    return this._fn('build', options);
  }

  errorv1_0(errors) {
    return new Promise((resolve, reject) => {
      if (_.isUndefined(errors)) {
        return reject('ERR_JSONAPI_ERROR_MISSING_ERRORS_DATA');
      }

      if (!_.isArray(errors)) {
        return reject('ERR_JSONAPI_ERROR_INVALID_ERRORS_DATA');
      }

      let results = {
        jsonapi: {
          version: this.version,
        },
        errors: [],
      };

      for (let error of errors) {
        let _error = {};

        if (!_.isPlainObject(error)) {
          return reject('ERR_JSONAPI_ERROR_INVALID_ERROR_DATA');
        }

        if (_.isUndefined(error.status)) {
          return reject('ERR_JSONAPI_ERROR_MISSING_STATUS');
        }

        if (_.isUndefined(error.code)) {
          return reject('ERR_JSONAPI_ERROR_MISSING_CODE');
        }

        _error.status = error.status;
        _error.code = error.code;

        if (error.title) {
          _error.title = error.title;
        }

        if (error.detail) {
          _error.detail = error.detail;
        }

        if (error.source) {
          _error.source = error.source;
        }

        results.errors.push(_error);
      }

      resolve(results);
    });
  }

  error(options) {
    return this._fn('error', options);
  }

  _buildv1_0(row, included, options, reject) {
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
        buildData = this._buildv1_0(options.data, included, options, reject);
      } else {
        for (let row of options.data) {
          buildData.push(this._buildv1_0(row, included, options, reject));
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
