//Native modules
import path from 'path';

const webpackUtilities = {
  localPath: (assetPath) => {
    return path.normalize(path.join(__dirname, assetPath));
  },
  localPathJoin: (pathGroup) => {
    return pathGroup.map((assetPath) => {
      return webpackUtilities.localPath(assetPath);
    });
  }
};

export default webpackUtilities;