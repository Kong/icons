# Kong Icons

Kong's open-source, Vue icon component library, partially sourced from [Google's Material Symbols](https://fonts.google.com/icons).

Vue components are generated from SVG source files located in the `/svg/` directory.

- [Usage](#usage)
  - [Installation](#installation)
  - [Import](#import)
  - [Component Props](#component-props)
- [Contributing \& Local Development](#contributing--local-development)
  - [SVG file requirements](#svg-file-requirements)
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

Notice that since the few styles that are included are inlined, there is no stylesheet to import.

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

#### `as`

- type: `String`
- required: `false`
- default: `'span'`

The HTML tag to use in place of the default wrapper `<span>` tag.

##### Example

```html
<CloseIcon as="button" />
```

## Contributing & Local Development

To get started, install the package dependencies

```sh
yarn install --frozen-lockfile
```

### SVG file requirements

Source SVG files **must**:

- be stored in the `/svg/` directory
  - All solid (single-color) icon SVG files **must** be placed in the `/svg/solid/` directory
  - All flag icon SVG files **must** be named following the format `{country code}.svg` and **must** be placed in the `/svg/flags/` directory. All country codes must be two-character strings.
  - All multi-color SVG files **must** be placed in the `/svg/multi-color/` directory
- have a **unique**, `kebab-case` filename, regardless of the `/svg/*` subdirectory they are located in
  - you don't need to add the word `icon` in the end of file name
  - the resulting exported icon name will be title-cased filename with word `Icon` in the end (e.g. `kebab-case -> KebabCaseIcon`)
- have a default size of `24px` when they are exported
- be sourced from and approved of by Kong's Design team

### Development Sandbox

This repository includes a Vue sandbox app (see the `/sandbox` directory) to allow you to experiment with icons.

Before running the local dev server, you will need to run the generate command.

> **Note**: You must regenerate the icons and restart the sandbox if you make changes to files outside of the `/sandbox/` directory.

To compile the icon components and start the sandbox:

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

Unit and component tests are run with [Vitest](https://vitest.dev/).

The Vitest settings are pre-configured to regenerate the icon components before every run.

```sh
# Run tests
yarn test

# Run tests in the Vitest UI
yarn test:open

# Update test snapshots
yarn test -u
```

When SVG files are added or removed, this will cause the test(s) that compare snapshots to fail. If the snapshot change is expected, run `yarn test -u` to update the test snapshots accordingly, then commit those changes to your branch.

### Build for production

Process the `/svg/` directory, generate the icon components and associated files, and build for production.

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
