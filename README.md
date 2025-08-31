# bun-react-tailwind-shadcn-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

## Code Quality

This project uses ESLint for code linting and quality checks.

### Linting

To check for code quality issues:

```bash
bun run lint
```

To automatically fix auto-fixable issues:

```bash
bun run lint:fix
```

The linter is configured with:
- TypeScript support
- React best practices
- React Hooks rules
- Fast refresh compatibility
- Browser environment globals

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## 🚀 Deployment

### Vercel (Recommended)

This project is configured for easy deployment on Vercel:

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Bun configuration
3. **Configure Environment Variables:**
   - Add `BUN_PUBLIC_DEVELOPER_TOKEN` with your Apple Music developer token
4. **Deploy!**

### Environment Variables

The following environment variables are required for production:

- `BUN_PUBLIC_DEVELOPER_TOKEN`: Your Apple Music developer token from the Apple Developer Console

### Local Development

To run locally with environment variables:

1. Create a `.env` file in the root directory
2. Add your environment variables:
   ```bash
   BUN_PUBLIC_DEVELOPER_TOKEN=your_token_here
   ```
3. Run `bun dev` to start the development server
