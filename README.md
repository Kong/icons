# Kong Icons

Kong's open-source, Vue icon component library, partially sourced from [Google's Material Symbols](https://fonts.google.com/icons).

**View all available icons: <http://kong.github.io/icons/>**

- [Usage](#usage)
  - [Installation](#installation)
  - [Import](#import)
  - [Component Props](#component-props)
- [Contributing \& Local Development](#contributing--local-development)
  - [SVG file requirements](#svg-file-requirements)
  - [Adding a new icon](#adding-a-new-icon)
  - [Development Sandbox](#development-sandbox)
  - [Lint and fix](#lint-and-fix)
  - [Testing](#testing)
  - [Build for production](#build-for-production)
  - [Committing Changes](#committing-changes)
  - [Approvals](#approvals)
  - [Package Publishing](#package-publishing)

## Usage

### Installation

Install the `@kong/icons` package in your host project.

```sh
pnpm add @kong/icons
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

Whether the SVG is meaningful to the page, or just complimentary. Utilized to expose or hide the SVG from screen readers and enable or disable pointer events.

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
pnpm install --frozen-lockfile
```

The exported Vue components are generated from SVG source files located in the `/svg/` child directories.

### SVG file requirements

Source SVG files **must**:

- have a **unique**, lowercase and kebab-case filename, regardless of the `/svg/*` subdirectory they are located in
  - file names **must** not include the word `icon` (the suffix is automatically added during component generation)
  - the resulting exported icon name will be a PascalCase file with an added `Icon` suffix (e.g. `kebab-case.svg -> KebabCaseIcon.vue`)
- be stored in the `/svg/` directory
  - All solid (single-color) icon SVG files **must** be placed in the `/svg/solid/` directory
  - All flag icon SVG files **must** be named following the format `{country code}.svg` and **must** be placed in the `/svg/flags/` directory. All country codes must be two-character strings.
  - All multi-color SVG files **must** be placed in the `/svg/multi-color/` directory
- have a default size of `24px` when they are exported
- be sourced from and approved of by Kong's Design team

### Adding a new icon

To add a new SVG:

1. Ensure the SVG has been exported from the Design team (do **not** create custom SVG files)
   1. Icons **must** follow the viewbox and color guidelines to match the standard of existing icons. New icons can be requested on Slack in `#ask-kong-design-system`
2. Ensure the filename is lowercase and kebab-case
3. Place the SVG file into the corresponding `/svg/*` subdirectory.
4. Locally, run `pnpm generate` to create the corresponding Vue component
5. Locally, run `pnpm test --update` to run the tests and update the test snapshots
6. [Commit your changes](#committing-changes) and push up a Pull Request for review

### Development Sandbox

This repository includes a Vue sandbox app (see the `/sandbox` directory) to allow you to experiment with icons.

The `pnpm dev` command will automatically call the `generate` command to generate the icon components.

To compile the icon components and start the sandbox:

```sh
# Generate the Icon Components and start the sandbox
pnpm dev
```

#### Build and Preview the Development Sandbox

To run a local preview of the Sandbox site that will be deployed to GitHub Pages:

```sh
pnpm build:sandbox
pnpm preview:sandbox
```

### Lint and fix

Lint package files, and optionally auto-fix detected issues.

```sh
# Lint only
pnpm lint

# Lint and fix
pnpm lint:fix
```

### Testing

Unit and component tests are run with [Vitest](https://vitest.dev/).

The Vitest settings are pre-configured to regenerate the icon components before every run.

```sh
# Run tests
pnpm test

# Run tests in the Vitest UI
pnpm test:open

# Update test snapshots
pnpm test --update
```

When SVG files are added or removed, this will cause the test(s) that compare snapshots to fail. If the snapshot change is expected, run `pnpm test --update` to update the test snapshots accordingly, then commit those changes to your branch.

### Build for production

Process the `/svg/` directory, generate the icon components and associated files, and build for production.

```sh
pnpm build
```

### Committing Changes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

[Commitizen](https://github.com/commitizen/cz-cli) and [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help build and enforce commit messages.

It is **highly recommended** to use the following command in order to create your commits:

```sh
pnpm commit
```

This will trigger the Commitizen interactive prompt for building your commit message.

#### Enforcing Commit Format

[Lefthook](https://github.com/evilmartians/lefthook) is used to manage Git Hooks within the repo.

- A `commit-msg` hook is automatically setup that enforces commit message stands with `commitlint`, see [`lefthook.ymal`](./lefthook.yaml)
- A `pre-push` hook is used that runs `eslint` before allowing you to push your changes to the repository

Additionally, CI will use `commitlint` to validate the commits associated with a PR in the `Lint and Validate` job.

### Approvals

- All pull requests require review and approval from authorized team members.
- Automated approvals through workflows are strictly prohibited.
  - There is an exception for automated pull request approvals originating from generated dependency updates that satisfy status checks and other requirements.
- Protected branches require at least one approval from code owners.
- All status checks must pass before a pull request may be merged.

### Package Publishing

This repository utilizes [Semantic Release](https://github.com/semantic-release/semantic-release) for automated package publishing and version updates.
