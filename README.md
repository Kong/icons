# Kong Icons

Kong's open-source, Vue icon component library, partially sourced from [Google's Material Symbols](https://fonts.google.com/icons).

Vue components are generated from SVG source files located in the `/svg/` directory.

- [Usage](#usage)
  - [Installation](#installation)
  - [Import](#import)
  - [Component Props](#component-props)
- [Contributing \& Local Development](#contributing--local-development)
  - [SVG Requirements](#svg-requirements)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Testing](#testing)
  - [Build for production](#build-for-production)
  - [Committing Changes](#committing-changes)
  - [Package Publishing](#package-publishing)


## Usage

### Installation

Install the `@kong/icons` package in your host project.

```sh
yarn add @kong/icons
```

### Import

Icons should be imported individually which allows for proper tree-shaking, so only import the icons you need.

```html
<template>
  <button>
    Add a service
    <AddIcon size="24" />
  </button>
</template>

<script setup lang="ts">
import { AddIcon } from '@kong/icons'
</script>
```

### Component Props

#### `title`

- type: `String`
- required: `false`
- default: `''`

The accessibility text provided to screen readers.

#### `color`

> **Note**: The `color` prop only impacts solid, single-color icons generated from the `/svg/solid/` directory.

- type: `String`
- required: `false`
- default: `'currentColor'`

Set the icon color to any valid CSS color value or `currentColor`, which inherits the text color of the icon's parent element.

#### `display`

- type: `String`
- required: `false`
- default: `'block'`

Set the CSS `display` property for the icon wrapper element.

#### `decorative`

- type: `Boolean`
- required: `false`
- default: `false`

Whether the SVG is meaningful to the page, or just complimentary. Utilized to expose or hide the SVG from screen readers.

#### `size`

- type: `[Number, String]`
- required: `false`
- default: `24`

The size of the icon, in pixels.

As a convenience, you may pass the size as a `number`, e.g. `24` or as a string that can be converted to an integer, such as `'48'`.

When utilizing a `string`, do not pass any units along with the value.

#### `tag`

- type: `String`
- required: `false`
- default: `'span'`

The HTML tag to use in place of the default wrapper `<span>` tag.

## Contributing & Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### SVG Requirements

- Source SVG filenames must be unique, regardless if they are in a subdirectory

### Development Sandbox

This repository includes a Vue sandbox (see the `/sandbox` directory) to allow you to experiment with icons.

To start the sandbox:

```sh
# Generate the Icon Components
yarn generate

# Start the sandbox
yarn dev
```

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
yarn lint

# Lint and fix
yarn lint:fix
```

### Testing

Unit and component tests are run with [Vitest](https://vitest.dev/)

```sh
# Run tests
yarn test

# Run tests in the Vitest UI
yarn test:open

# Update test snapshots
yarn test -u
```

When SVG files are added or removed, this will cause the test that compares the component snapshot exports to fail. If the snapshot change is expected, run `yarn test -u` to update the test snapshots accordingly.

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
