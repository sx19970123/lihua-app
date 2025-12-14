# Lihua App

This is a cross-platform application built with Vue and TypeScript, designed to deliver a modern mobile experience.

## Features

- Built with Vue 3 and TypeScript
- Supports cross-platform execution (including WeChat Mini Programs, etc.)
- Provides a rich set of UI components and utility functions
- Includes state management, network requests, encryption, and other functionalities

## Directory Structure

```
├── .env.development                # Development environment configuration file
├── .env.production                 # Production environment configuration file
├── .gitignore                      # Git ignore file configuration
├── LICENSE                         # Project license
├── index.html                      # Entry HTML file
├── package.json                    # Project dependencies and script configuration
├── plugins/buildIcons.ts           # Icon build script
├── shims-uni.d.ts                  # Uni-app type declaration file
├── src/                            # Source code directory
│   ├── App.vue                     # Root Vue component
│   ├── AppRoot.vue                 # Application root component
│   ├── api/                        # API definitions
│   ├── components/                 # Common components
│   ├── env.d.ts                    # Environment variable type definitions
│   ├── main.ts                     # Application entry file
│   ├── manifest.json               # Application manifest file
│   ├── pages.json                  # Page configuration file
│   ├── pages/                      # Page components
│   ├── router/                     # Routing configuration
│   ├── shime-uni.d.ts              # Uni-app type declaration file
│   ├── static/                     # Static assets
│   ├── stores/                     # State management
│   ├── subpackages/                # Sub-packages
│   ├── theme.json                  # Theme configuration file
│   ├── uni.scss                    # Global styles file
│   ├── utils/                      # Utility functions
│   └── vite.config.ts              # Vite configuration file
```

## Installation Guide

1. Ensure Node.js and npm are installed
2. Clone the repository: `git clone https://gitee.com/yukino_git/lihua-app.git`
3. Navigate to the project directory: `cd lihua-app`
4. Install dependencies: `npm install`

## Usage Instructions

- Development mode: `npm run dev`
- Build for production: `npm run build`
- View documentation: `npm run serve`

## Contribution Guide

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Submit a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.