# Energent.ai Frontend

## Technologies Used

- **React** - A JavaScript library for building user interfaces
- **TypeScript** - Static type-checking for JavaScript
- **Tailwind CSS 4** - A utility-first CSS framework
- **Shadcn** - Component library for Tailwind CSS
- **Framer Motion** - Animation library for React
- **Lucide Icons** - Beautiful & consistent icons
- **Bun** - A fast JavaScript runtime & package manager
- **Vite** - Next generation frontend tooling

## Features

- Create, toggle, and delete todos
- Smooth animations with Framer Motion
- Beautiful UI with Tailwind CSS and daisyUI
- Responsive design

## Getting Started

### Prerequisites

- Bun (latest version)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/energent.ai.git
   cd energent.ai
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Start the development server
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
bun run build
```

The build files will be in the `dist` directory.

## Preview the Production Build

```bash
bun run preview
```

## Continuous Deployment

The project is configured with GitHub Actions for continuous deployment to the production server.

### Setting Up Deployment

1. Generate an SSH key pair (if you don't already have one)
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy"
   ```

2. Add the public key to the server's authorized_keys file
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@52.14.32.213
   ```

3. Add the private key as a GitHub repository secret
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Create a new repository secret with the name `SSH_PRIVATE_KEY`
   - Paste the entire contents of your private key file (including BEGIN and END lines)

4. The workflow will automatically deploy to production when changes are pushed to the main branch

## License

This project is licensed under the MIT License.
