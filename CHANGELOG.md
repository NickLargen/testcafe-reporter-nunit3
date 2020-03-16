# [2.0.0-beta.1](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/v1.1.0-beta.3...v2.0.0-beta.1) (2020-03-16)


### Bug Fixes

* improve file path calculations so that test outputs are OS agnostic ([53beef9](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/53beef971f2c6e0f0ccb1e432e5a8cec14c8dae4))
* use OS agnostic file paths ([3a3fddc](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/3a3fddc8804bb44c04b0ddf394178997b11c7c04))


### Features

* add missing details to error messages and properly align stack traces, ([f965994](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/f965994fbaca80b0336e5315bfac4017a45731c5))
* emit relative file paths instead of absolute ([a46388b](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/a46388b0d2ee964bd41508cc5af137d0fe46bf3c))
* fail test run if not all tests complete ([704700c](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/704700c058f132971be2245864bc4a3239d691ba))
* update TestCafe past 1.0 ([f9b9b57](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/f9b9b5754c77be1d55ed836955df06f31048b217))
* use an emoji to emphasize the distinction between different errors in the same test ([1182c88](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/1182c88c56b706dbe3c8ff21cfaa5ed0905eca39))


### BREAKING CHANGES

* Errors in the test process can no longer be detected by checking for a blank result
file.
* Screenshots and source locations use relative file paths. When uploading results
make sure your current working directory relative to your screenshots directory is the same as when
the tests ran.

# [1.1.0-beta.3](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2020-03-15)

### Bug Fixes

- ::set-env not found during ci ([7216c83](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/7216c8328a6e9d1e8ca68bf59684d585bacc052b))

# [1.1.0-beta.2](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2020-03-15)

### Bug Fixes

- use GitHub syntax for sharing environment variables between steps ([2e8b371](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/2e8b3714d39c703eb7d863dc652046cb6e01dde4))

# [1.1.0-beta.1](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/v1.0.12...v1.1.0-beta.1) (2020-03-15)

### Features

- test ci configuration with a prerelease minor version bump ([3125801](https://github.com/NickLargen/testcafe-reporter-nunit3/commit/3125801371440effbe8437b7a6b66c87c9a9dd61))

## [1.0.5 -> 1.0.12](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/v1.0.4...v1.0.12) (2020-03-15)

- Play around with CI configuration

## [1.0.4](https://github.com/NickLargen/testcafe-reporter-nunit3/compare/1.0.3...v1.0.4) (2020-03-14)

- Update Handlebars to resolve security vulnerability
- Start using GitHub Actions with Semantic Release for publishing

## [1.0.3](https://github.com/NickLargen/testcafe-reporter-nunit3/tree/1.0.3) (2020-07-22)

Initial working release
