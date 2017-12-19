import test from 'tape';
import updateFeaturesWithQuery from '../update-features-with-query';
import deepFreeze from 'deep-freeze';
import createFeature from '../test-fixtures/create-feature';

test('updateFeaturesWithQuery()', ({ end, deepEqual }) => {
  const actual = updateFeaturesWithQuery();
  const expected = [];
  const msg = 'it should return an empty array';
  deepEqual(actual, expected, msg);
  end();
});

test('updateFeaturesWithQuery([])', ({ end, deepEqual }) => {
  const actual = updateFeaturesWithQuery([]);
  const expected = [];
  const msg = 'it should return an empty array';
  deepEqual(actual, expected, msg);
  end();
});

test('updateFeaturesWithQuery([], Object)', ({end, deepEqual}) => {
  const actual = updateFeaturesWithQuery([], { q: 'js'});
  const expected = [];
  const msg = 'it should return an empty array';
  deepEqual(actual,expected,msg);
  end();
});

test('updateFeaturesWithQuery([...Feature], Object)', ({end, deepEqual}) => {
  const features = [
    createFeature({
      name: 'posts',
      enabled: true
    }),
    createFeature({
      name: 'post-rating',
      enabled: false,
      dependencies: ['posts']
    }),
    createFeature({
      name: 'post-rating-graph',
      enabled: true,
      dependencies: ['post-rating']
    }),
    createFeature({
      name: 'reports',
      enabled: false
    })
  ];
  deepFreeze(features);
  {
    const actual = updateFeaturesWithQuery(features, {});
    const expected = features;
    const msg = 'it should return the unmodified features when a empty query is provided';
    deepEqual(actual, expected, msg);
  }
  {
    const actual = updateFeaturesWithQuery(features, { q: 'js' });
    const expected = features;
    const msg = 'it should return the unmodified features when query does not have ft params';
    deepEqual(actual, expected, msg);
  }
  {
    const expectedFeatures = [...features];
    expectedFeatures[1] = {...expectedFeatures[1], enabled: true};
    expectedFeatures[3] = {...expectedFeatures[3], enabled: true};
    const actual = updateFeaturesWithQuery(features, { ft: 'post-rating,reports,login' });
    const expected = expectedFeatures;
    const msg = 'it should return the correct features';
    deepEqual(actual, expected, msg);
  }
  end();
});
