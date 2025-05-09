#!/bin/bash

# Make script executable with: chmod +x setup.sh
# Run with: ./setup.sh "new-site-name"

if [ -z "$1" ]
then
    echo "Please provide a name for your new site"
    echo "Usage: ./setup.sh new-site-name"
    exit 1
fi

# Create new directory
mkdir -p "../$1"

# Copy all files except node_modules, .git, and .next
rsync -av --progress ./ "../$1" \
    --exclude node_modules \
    --exclude .git \
    --exclude .next \
    --exclude setup.sh

# Navigate to new directory
cd "../$1"

# Initialize new git repository
git init

# Install dependencies
npm install

# Create images directory
mkdir -p public/images

# Copy .env.example to .env
cp .env.example .env

echo "Setup complete! Your new site is ready at ../$1"
echo "Next steps:"
echo "1. Update package.json with your new site name"
echo "2. Update .env with your site's configuration"
echo "3. Add your images to public/images/"
echo "4. Run 'npm run dev' to start development"
echo "5. Run 'npm run sanity dev' to access Sanity Studio" 