# Hermes API

Hermes is a sophisticated logistics management API designed to streamline cargo and transportation operations for shipping companies and carriers. Built with the robust NestJS framework and secured by Keycloak authentication, this platform provides a comprehensive solution for managing freight logistics, shipment tracking, carrier coordination, and delivery optimization. 

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/) (DevContainer)
- [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Good to have infra running](https://github.com/hermes-tek/infra)

## Environment Setup

Create a `.env` file from a copy of the `.env.example` file in the root directory:

```bash
cp .env.example .env
```

Then update the values in the `.env` file according to your environment configuration.

For Keycloak setup details, refer to the [Keycloak setup instructions](/docs/keycloak-instructions.md).

## Running the Project

### Using Docker Compose (Simplest Option)

```bash
# Clone the repository
git clone https://github.com/hermes-tek/hermes.git
cd hermes

# Create and configure .env file
cp .env.example .env

# Start the containers
docker-compose up -d

# Check the logs (optional)
docker-compose logs -f
```

The API will be available at: http://localhost:3000

### Using DevContainer in VS Code

DevContainers provide a consistent development environment across the team. To use it:

1. Install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VS Code

2. Clone the repository and open it in VS Code:
   ```bash
   git clone https://github.com/hermes-tek/hermes.git
   cd hermes
   code .
   ```

3. When prompted, click "Reopen in Container" or press F1 and select "Remote-Containers: Reopen in Container"

4. VS Code will build the DevContainer (this may take a few minutes the first time)

5. Once inside the DevContainer, terminal commands will run inside the container:
   ```bash
   # Install dependencies
   npm install
   
   # Create and configure .env file
   cp .env.example .env
   
   # Start the development server
   npm run start:dev
   ```

6. The API will be available at: http://localhost:3000

### DevContainer Features

- Runs on Alpine Linux v3.22
- Pre-configured development environment
- Node.js v22.17.0 pre-installed
- Shared Docker socket for Docker-in-Docker support
- Useful utilities included: git, curl, wget, etc.
- DevContainer settings can be customized in `.devcontainer/devcontainer.json`
