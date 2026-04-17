import type { SchemaVersion } from 'schema-manager-schemas';

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
 * Sort an array of Schema versions by their version number.
 * @param versions - The versions to sort.
 * @param dir - The direction to sort the versions.
 * @returns The sorted versions
 */
export const sortVersions = (versions: SchemaVersion[], dir: 'asc' | 'desc' = 'desc'): SchemaVersion[] => {
  const sortedDesc = versions.sort((highest, current) => {
    const [highMajor, highMinor, highPatch] = highest.id.split('.').map((part) => Number.parseInt(part, 10));
    const [currMajor, currMinor, currPatch] = current.id.split('.').map((part) => Number.parseInt(part, 10));

    if (currMajor !== highMajor) {
      return currMajor > highMajor ? 1 : -1;
    }

    if (currMinor !== highMinor) {
      return currMinor > highMinor ? 1 : -1;
    }

    return currPatch > highPatch ? 1 : -1;
  });

  if (dir === 'desc') {
    return sortedDesc;
  }

  return sortedDesc.reverse();
};

/**
 * Finds the latest schema version from a list of schema versions
 * @param versions - Array of Schema Versions
 * @returns The latest schema version in the array.
 */
export const getLatestVersion = (versions: SchemaVersion[]): SchemaVersion | undefined => {
  if (versions.length === 0) {
    return undefined;
  }

  return sortVersions(versions)[0];
};

/**
 * Finds the latest semver version number from a list of schema versions.
 * @param versions - Array of schema version numbers
 * @returns The highest semver version number, or 0.0.0 if the array is empty.
 */
export const getLatestVersionNumber = (versions: SchemaVersion[]): string => {
  return getLatestVersion(versions)?.id || '0.0.0';
};
