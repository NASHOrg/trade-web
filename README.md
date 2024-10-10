# Nuxt 3 Template 

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

- [NextUI](https://ui.nuxt.com/)

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

##　Yapi Usage

1. Create `.yapirc` in root directory

```
YAPI_TOKEN=xxxx
```

2. Run generate script

```bash
yarn sync_api
yarn generate_api
```

## Code Format

```
yarn lint:fix
```

## Icons and Svg

For icons, search icons at https://icones.js.org/ , copy the icon name and use it directly.

```vue
<UIcon name="i-heroicons-moon" />
```

For custom svg, put svg file in `/assets/icons`, you can use it as component with `Icon` prefix.
```vue
<IconBool />
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# yarn
yarn build
```

Locally preview production build:

```bash
# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
