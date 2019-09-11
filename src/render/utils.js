import _ from 'lodash';

export function get(object, path, defaultValue) {
  return _.get(object, path, defaultValue);
}
