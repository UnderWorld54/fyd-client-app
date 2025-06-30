const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const defaultConfig = getSentryExpoConfig(__dirname);
const withStorybook = require('@storybook/react-native/metro/withStorybook'); 

module.exports = withStorybook(defaultConfig); 
