const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

// One React instance for the whole monorepo (avoids "useState of null" / invalid hooks).
config.resolver.nodeModulesPaths = [
  path.resolve(monorepoRoot, "node_modules"),
  path.resolve(projectRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = true;

const reactDir = path.resolve(monorepoRoot, "node_modules/react");
const reactNativeDir = path.resolve(monorepoRoot, "node_modules/react-native");

config.resolver.extraNodeModules = {
  react: reactDir,
  "react-native": reactNativeDir,
};

module.exports = config;
