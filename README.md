# DSC481 - Fundamentals of Data Science

A web-based course material viewer for DSC 481 - Fundamentals of Data Science at Pokhara University, Faculty of Management Studies.

## Features

- 📁 Browse course units and materials
- 📊 View Marp presentations (HTML) with full presenter mode support
- 📝 View Markdown files with proper formatting
- 🎨 Clean, responsive UI

## Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **Marp** - Presentation slides

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── components/      # React components
├── content/         # Course materials (units, slides, etc.)
├── pages/           # Next.js pages
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Content Structure

Course materials are organized in the `content/` folder:

```
content/
└── Unit-1/
    ├── Slides.html          # Marp presentation (HTML export)
    ├── Slides.md            # Marp presentation source
    ├── Practice Questions.html
    └── Practice-Questions.md
```

- `.html` files open in a new tab with full Marp presentation features
- `.md` files display as scrollable formatted content

## License

This project is for educational purposes.
