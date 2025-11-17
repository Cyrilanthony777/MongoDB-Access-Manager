# MongoDB Access Manager

A modern, web-based interface for managing MongoDB users, roles, and privileges. Built with Next.js, TypeScript, and Tailwind CSS, this tool provides an intuitive way to handle MongoDB access control without needing to use the MongoDB shell.

## Features

- **User Management**: Create, view, and manage MongoDB database users
- **Role Management**: Define custom roles with specific privileges
- **Privilege Builder**: Visual interface for configuring database privileges
- **Grant Roles**: Easily assign roles to users
- **Connection Support**: Connect to MongoDB with or without authentication
- **Secure Authentication**: Session-based authentication with secure cookie storage
- **Modern UI**: Clean, responsive interface built with shadcn/ui components
- **Real-time Updates**: Instant feedback on all operations

## Screenshots

_Screenshots will be added soon_

## Demo

_Demo link will be added soon_

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB instance (local or remote)

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mongodb-access-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Add any additional environment variables here if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t mongodb-access-manager .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:8080 mongodb-access-manager
   ```

3. **Access the application**

   Navigate to [http://localhost:8080](http://localhost:8080)

## Usage

### Connecting to MongoDB

1. On the login page, enter your MongoDB connection details:
   - **MongoDB URL**: Connection string (e.g., `mongodb://localhost:27017`)
   - **Username**: (Optional) MongoDB username
   - **Password**: (Optional) MongoDB password

2. Click "Connect" to establish a connection

### Managing Users

- View all database users in the Users tab
- Create new users with specific credentials
- Assign roles to users for access control

### Managing Roles

- Browse existing MongoDB roles
- Create custom roles with specific privileges
- Define database-level and collection-level permissions

### Building Privileges

- Use the visual privilege builder to configure access rights
- Select databases and collections
- Choose specific actions (read, write, admin, etc.)
- Apply privileges to roles

## Built With

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)** - Official MongoDB driver
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── mongodb/      # MongoDB operation endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard.tsx     # Main dashboard component
│   ├── login-form.tsx    # Login form
│   ├── users-manager.tsx # User management
│   ├── roles-manager.tsx # Role management
│   └── role-privilege-builder.tsx # Privilege builder
├── lib/
│   ├── mongodb.ts        # MongoDB client setup
│   ├── mongodb-auth.ts   # Authentication utilities
│   └── utils.ts          # Helper functions
├── hooks/
│   └── use-toast.ts      # Toast notification hook
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
└── package.json          # Dependencies
```

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [Issues](../../issues) section
2. If not, create a new issue with a clear description
3. Include steps to reproduce (for bugs) or use cases (for features)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/mongodb-access-manager.git
   cd mongodb-access-manager
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Wait for review and address feedback

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing component structure
- Add comments for complex logic
- Keep components small and focused
- Use existing UI components from shadcn/ui
- Ensure responsive design for all screen sizes

## Security

- Never commit sensitive data (passwords, connection strings, etc.)
- The `.env.local` file is gitignored by default
- Session data is stored securely in HTTP-only cookies
- All MongoDB connections are authenticated at the session level

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the need for better MongoDB access management tools

## Support

If you find this project helpful, please consider:
- Starring the repository ⭐
- Sharing it with others
- Contributing to the codebase
- Reporting issues and suggesting improvements

## Roadmap

- [ ] Add bulk user operations
- [ ] Implement role templates
- [ ] Add audit logging
- [ ] Support for MongoDB Atlas
- [ ] Multi-cluster management
- [ ] Export/import role configurations
- [ ] Dark mode support

## Contact

For questions or support, please open an issue in the GitHub repository.

---

Made with ❤️ by the open source community
