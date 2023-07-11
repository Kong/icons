# Kong Icons

Kong's open-source icon component library.

- [Contributing \& Local Development](#contributing--local-development)
  - [SVG Requirements](#svg-requirements)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Build for production](#build-for-production)
  - [Committing Changes](#committing-changes)
  - [Package Publishing](#package-publishing)

## Contributing & Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### SVG Requirements

<!-- TODO: Add a script rule to enforce -->
- Source svg filenames must be unique, regardless if they are in a subdirectory

### Development Sandbox

This repository includes a Vue sandbox (see the `/sandbox` directory) to allow you to experiment with icons.

To start the sandbox:

```sh
yarn dev
```

<!-- This command will simultaneously start the Vite dev server and initialize a watcher on the `/tokens` directory. If any files in the `/tokens` directory are modified, the sandbox will automatically run the build command to update the tokens and then restart the Vite dev server (simulating hot module reload).

Updating any files within the sandbox itself will also trigger hot module reload as expected. -->

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
yarn lint

# Lint and fix
yarn lint:fix
```

### Build for production

Utilize the `style-dictionary` CLI to build the token assets for production based on the configuration in `/config.js`.

```sh
yarn build
```

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command in order to create your commits:

```sh
yarn commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.yml`](./lefthook.yaml)
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

### Package Publishing

This repository utilizes [Semantic Release](https://github.com/semantic-release/semantic-release) for automated package publishing and version updates.
