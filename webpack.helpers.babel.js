const webpackUtilities = {
  localPath: (assetPath) => {
    return __dirname + assetPath;
  },
  localPathJoin: (pathGroup) => {
    return pathGroup.map((assetPath) => {
      return webpackUtilities.localPath(assetPath);
    });
  }
};

export default webpackUtilities;