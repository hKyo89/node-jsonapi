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

  error(options) {
    return this._fn('error', options);
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
          version: this.version
        },
        errors: []
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

  build(options) {
    return this._fn('build', options);
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

      options.singular = options.singular || false;
      let buildData = options.singular
        ? {}
        : [];
      let included = [];

      if (options.singular) {
        buildData = this._buildv1_0(options.data, included, options, reject);
      } else {
        for (let row of options.data) {
          buildData.push(this._buildv1_0(row, included, options, reject));
        }
      }

      let results = {
        jsonapi: {
          version: this.version
        },
        data: buildData
      };

      if (included.length > 0) {
        results.included = included;
      }

      resolve(results);
    });
  }

  _buildv1_0(row, included, options, reject) {
    let keys = Object.keys(row);
    let relNames;

    if (options.relationships) {
      relNames = Object.keys(options.relationships);
    }

    let relId = 'id';
    let relType;
    let _included;
    let idKey;

    let data = {
      type: options.type
    };

    if (keys.indexOf('id') < 0) {
      if (_.isUndefined(options.id)) {
        return reject('ERR_JSONAPI_MISSING_DATA_ID');
      }

      idKey = options.id;
    }

    keysLoop : for (let col of keys) {
      if (options.relationships) {
        if (_.isUndefined(data.relationships)) {
          data.relationships = {};
          _included = {};
        }

        for (let relName of relNames) {
          let relScheme = options.relationships[relName];

          if (_.isUndefined(data.relationships[relName])) {
            data.relationships[relName] = {
              data: {}
            };

            if (relScheme.singular) {
              if (_.isUndefined(data.relationships[relName].meta)) {
                data.relationships[relName].meta = {};
              }

              data.relationships[relName].meta.singular = true;
            }
          }

          if (options.relationships[relName].object) {
            if (col === relName) {
              if (_.isPlainObject(row[col])) {
                data.relationships[relName].data.id = relId = row[col].id;
                data.relationships[relName].data.type = relType = relScheme.type;
                _included[col] = row[col];
              }

              // TODO: Refactor with above
              if (_.isArray(row[col])) {
                for (let rel of row[col]) {
                  // TODO: Refactor to clean logic
                  if (_.isPlainObject(data.relationships)) {
                    data.relationships = [];
                  }

                  let _relData = {};
                  _relData[relName] = {
                    data: {}
                  };

                  _relData[relName].data.id = relId = rel.id;
                  _relData[relName].data.type = relType = relScheme.type;
                  _included[col] = rel;

                  data.relationships.push(_relData)
                }
              }

              continue keysLoop;

            }
          } else {
            if (relScheme.attributes.indexOf(col) >= 0) {
              if (relScheme.id === col) {
                data.relationships[relName].data.id = relId = row[col];
                data.relationships[relName].data.type = relType = relScheme.type;
                continue keysLoop;
              }

              _included[col] = row[col];
              continue keysLoop;
            }
          }

        }
      }

      if (col.toLowerCase() === 'id' || col === idKey) {
        data.id = row[col];
        continue;
      }

      if (_.isUndefined(data.attributes)) {
        data.attributes = {};
      }

      data.attributes[col] = row[col];
    }

    if (_included) {
      if (typeof relId === 'undefined') {
        return reject('ERR_JSONAPI_MISSING_BUILD_RELATIONSHIP_ID');
      }

      if (!_.find(included, {
        type: relType,
        id: relId
      })) {
        included.push({type: relType, id: relId, attributes: _included});
      }
    }

    if (typeof data.id === 'undefined') {
      return reject('ERR_JSONAPI_MISSING_BUILD_DATA_ID');
    }

    return data;
  }

  parse(json) {
    return this._fn('parse', json);
  }

  parsev1_0(json) {
    if (!_.isObject(json)) {
      return Promise.reject('ERR_JSONAPI_PARSE_INVALID_DATA');
    }

    if (_.isUndefined(json.jsonapi)) {
      return Promise.reject('ERR_JSONAPI_PARSE_INVALID_JSON');
    }

    if (_.isUndefined(json.jsonapi.version)) {
      return Promise.reject('ERR_JSONAPI_PARSE_MISSING_VERSION');
    }

    if (json.jsonapi.version !== '1.0') {
      return Promise.reject('ERR_JSONAPI_PARSE_INVALID_VERSION');
    }

    if (_.isUndefined(json.data)) {
      return Promise.reject('ERR_JSONAPI_PARSE_MISSING_PAYLOAD');
    }

    if (!_.isObject(json.data)) {
      return Promise.reject('ERR_JSONAPI_PARSE_INVALID_PAYLOAD');
    }

    let results = {};

    if (_.isArray(json.data)) {
      for (let row of json.data) {
        this._parse(row, json, results, false);
      }
    } else {
      this._parse(json.data, json, results, true);
    }

    return Promise.resolve(results);
  }

  _parse(row, json, results, singular, isChild) {
    if (!isChild) {
      if (_.isUndefined(results.data)) {
        if (singular) {
          results.data = {};
        } else {
          results.data = [];
        }
      }
    }

    let _data = {};
    let type;

    let keys = Object.keys(row);

    for (let col of keys) {
      if (col.toLowerCase() === 'type') {
        type = row.type;
        continue;
      }

      if (col.toLowerCase() === 'id') {
        _data[`${type}Id`] = row[col];
        continue;
      }

      if (col.toLowerCase() === 'attributes') {
        let attrKeys = Object.keys(row[col]);

        for (let attrKey of attrKeys) {
          _data[attrKey] = row[col][attrKey];
        }
        continue;
      }

      if (col.toLowerCase() === 'relationships') {
        let relKeys = Object.keys(row[col]);

        for (let relType of relKeys) {
          let relData = row[col][relType].data;
          let relMeta = row[col][relType].meta;

          if (_.isUndefined(relData.type)) {
            return Promise.reject('ERR_JSONAPI_PARSE_MISSING_RELATIONSHIP_TYPE');
          }

          if (_.isUndefined(relData.id)) {
            return Promise.reject('ERR_JSONAPI_PARSE_MISSING_RELATIONSHIP_ID');
          }

          let includedData = _.find(json.included, {
            type: relData.type,
            id: relData.id
          });

          if (_.isUndefined(_data[relType])) {
            _data[relType] = [];
          }

          this._parse(includedData, json, _data[relType], false, true);

          if (relMeta.singular) {
            _data[relType] = _data[relType][0];
          }
        }
      }
    }

    if (!isChild) {
      if (singular) {
        results.data = _data;
      } else {
        results.data.push(_data);
      }
    } else {
      results.push(_data);
    }
  }
}

module.exports = JSONApi;
