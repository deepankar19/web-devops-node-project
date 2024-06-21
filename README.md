# web-devops-node-project
working on testing Devops project with Kubernetes and Gitlab action

### Detailed step-by-step for creation of the Intership project

# Step 1: Set Up GitHub Repository
# Step 2: Develop the Web Application
 ** Frontend {REACT JS} 
    npx create-react-app frontend
 ** Backend {NODE JS}
    npm install express
    # Create a simple Express server in `backend/server.js`:

     **********************************************
     const express = require('express');
     const app = express();
     const port = 3001;

     app.get('/', (req, res) => {
       res.send('Hello, World!');
     });

     app.listen(port, () => {
       console.log(`Backend running at http://localhost:${port}`);
     });
     ************************************************************* 
 
 # Step 3: Containerization
   1. **Dockerfile for Frontend**
  ```
     FROM node:14-alpine

     WORKDIR /app

     COPY package.json ./
     RUN npm install

     COPY . ./

     RUN npm run build

     CMD ["npx", "serve", "-s", "build"]
     EXPOSE 3000
     ```

   - Build container for the frontend:

     ```
     docker build -t devilvires/inter-frontend-app:01 .
     docker run -itd -p 3000:3000 devilvires/inter-frontend-app:01
     docker push devilvires/inter-frontend-app:01

     ```

2. **Dockerfile for Backend**

   ```
   FROM node:14-alpine

     WORKDIR /app

     COPY package.json ./
     RUN npm install

     COPY . ./

     CMD ["node", "server.js"]
     EXPOSE 3001
     ```
   - Build container for the backend:

    ```
    docker build -t devilvires\backend-app:01 .
    docker run -itd -p 3001:3001 devilvires/inter-backend-app:01
    docker push devilvires/inter-backend-app:01

    ```
# Step 4: CI/CD Pipeline with GitHub Actions

- Create a `.github/workflows/ci-cd.yml`:
     ```yaml
     name: CI/CD Pipeline

     on:
       push:
         branches:
           - main

     jobs:
       build:
         runs-on: ubuntu-latest

         steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Build frontend
           working-directory: ./frontend
           run: |
             npm install
             npm run build

         - name: Build backend
           working-directory: ./backend
           run: |
             npm install

         - name: Build Docker images
           run: |
             docker build -t devilvires/inter-frontend-app:01 ./frontend
             docker build -t devilvires/inter-backend-app:01 ./backend

         - name: Log in to Docker Hub
           uses: docker/login-action@v2
           with:
             username: ${{ secrets.DOCKER_USERNAME }}
             password: ${{ secrets.DOCKER_PASSWORD }}

         - name: Push Docker images
           run: |
             docker tag inter-frontend-app devilvires/inter-frontend-app:01
             docker tag inter-backend-app devilvires/inter-backend-app:01
             docker push devilvires/inter-frontend-app:01
             docker push devilvires/inter-backend-app:01

         - name: Deploy to AWS
           uses: aws-actions/configure-aws-credentials@v1
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1

        # - name: Deploy to ECS
        #   run: |
        # # Install kubectl
        # curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.9/2020-11-02/bin/linux/amd64/kubectl
        # chmod +x ./kubectl
        # sudo mv ./kubectl /usr/local/bin/

        # # Update kubeconfig
        # aws eks update-kubeconfig --region us-east-1 --name your-cluster-name

        # # Deploy Kubernetes resources
        # kubectl apply -f k8s/
     ```