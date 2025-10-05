#!/bin/bash

# Comla Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting Comla Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    print_status "Dependencies check passed ✓"
}

# Setup backend environment
setup_backend() {
    print_status "Setting up backend..."

    cd backend

    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating from example..."
        if [ -f ".env.production.example" ]; then
            cp .env.production.example .env.production
            print_error "Please edit .env.production with your actual production values before continuing."
            exit 1
        else
            print_error ".env.production.example not found. Please create production environment file."
            exit 1
        fi
    fi

    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install --production

    # Run database seed (optional)
    if [ "$1" = "--seed" ]; then
        print_status "Seeding database..."
        npm run seed
    fi

    cd ..
    print_status "Backend setup completed ✓"
}

# Setup frontend environment
setup_frontend() {
    print_status "Setting up frontend..."

    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env not found. Creating..."
        echo "REACT_APP_API_URL=https://your-backend-url.com" > .env
        print_error "Please edit .env with your actual API URL before continuing."
        exit 1
    fi

    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install

    # Build for production
    print_status "Building frontend for production..."
    npm run build

    print_status "Frontend setup completed ✓"
}

# Deploy to Vercel (frontend)
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."

    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi

    # Deploy
    vercel --prod

    print_status "Frontend deployed to Vercel ✓"
}

# Deploy to Render (backend)
deploy_backend() {
    print_status "Deploying backend to Render..."

    print_warning "Please manually deploy backend to Render:"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create a new Web Service"
    echo "4. Set build command: npm install"
    echo "5. Set start command: npm start"
    echo "6. Add environment variables from .env.production"
    echo "7. Deploy!"

    print_status "Backend deployment instructions provided ✓"
}

# Main deployment flow
main() {
    echo "🎓 Comla College Finder - Production Deployment"
    echo "=============================================="

    # Parse arguments
    SEED_DB=false
    if [ "$1" = "--seed" ]; then
        SEED_DB=true
    fi

    check_dependencies
    setup_backend $SEED_DB
    setup_frontend

    echo ""
    print_status "Local setup completed! Ready for deployment."
    echo ""

    read -p "Do you want to deploy to Vercel now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_frontend
    fi

    echo ""
    deploy_backend

    echo ""
    print_status "🎉 Deployment preparation completed!"
    print_warning "Don't forget to:"
    echo "  - Update DNS settings if needed"
    echo "  - Configure SSL certificates"
    echo "  - Set up monitoring and alerts"
    echo "  - Test the production deployment thoroughly"
}

# Run main function
main "$@"