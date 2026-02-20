/**
 * Increments a semantic version based on the specified increment type.
 * @param version - The current semantic version string (e.g., "1.2.3")
 * @param increment - The part to increment: 'major', 'minor', or 'patch'
 * @returns The new incremented semantic version
 */
const incrementVersion = (
  version: string,
  increment: 'major' | 'minor' | 'patch',
): string => {
  const parts = version.split('.');
  const major = Number.parseInt(parts[0], 10);
  const minor = Number.parseInt(parts[1], 10);
  const patch = Number.parseInt(parts[2], 10);

  switch (increment) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
};

/**
 * Increments the major version number.
 * @param version - The current semantic version string (e.g., "1.2.3")
 * @returns The new version with incremented major number
 */
export const incrementMajor = (version: string): string =>
  incrementVersion(version, 'major');

/**
 * Increments the minor version number.
 * @param version - The current semantic version string (e.g., "1.2.3")
 * @returns The new version with incremented minor number
 */
export const incrementMinor = (version: string): string =>
  incrementVersion(version, 'minor');

/**
 * Increments the patch version number.
 * @param version - The current semantic version string (e.g., "1.2.3")
 * @returns The new version with incremented patch number
 */
export const incrementPatch = (version: string): string =>
  incrementVersion(version, 'patch');

/**
 * Finds the highest semver version from a list of schema versions.
 * @param versions - Array of schema versions
 * @returns The highest semver version string, or an empty string if the array is empty
 */
export const getHighestVersion = (versions: string[]): string => {
  return versions.reduce((highest, current) => {
    const [highMajor, highMinor, highPatch] = highest.split('.').map((part) => Number.parseInt(part, 10));
    const [currMajor, currMinor, currPatch] = current.split('.').map((part) => Number.parseInt(part, 10));

    if (currMajor !== highMajor) {
      return currMajor > highMajor ? current : highest;
    }

    if (currMinor !== highMinor) {
      return currMinor > highMinor ? current : highest;
    }

    return currPatch > highPatch ? current : highest;
  });
};
