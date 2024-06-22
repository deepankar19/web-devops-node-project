# web-devops-node-project  
working on testing Devops project with Kubernetes and Gitlab action

### Detailed step-by-step for creation of the Intership project

# Step 1: Set Up GitHub Repository

    1. **Create a GitHub Repository**
       - Go to GitHub and create a new public repository.
       - Name the repository appropriately, e.g., `web-devops-node-project`.

    2. **Clone the Repository Locally**
      - Open a terminal and run:
        ```sh
        git clone https://github.com/devilvires/web-devops-node-project.git
        cd web-devops-node-project
        ```
# Step 2: Develop the Web Application
 ```
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
 ```
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
# Step 4: Deployment with Infrastructure as Code



# Step5: CI/CD Pipeline with GitHub Actions

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
            docker push devilvires/inter-frontend-app:01
            docker push devilvires/inter-backend-app:01

        - name: Deploy to AWS
          uses: aws-actions/configure-aws-credentials@v1
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: us-east-1

        - name: Setup Terraform
          uses: hashicorp/setup-terraform@v1
          with:
            terraform_version: 1.0.0

        - name: Terraform Init
          run: terraform init
          working-directory: ./terraform

        - name: Terraform Apply
          run: terraform apply -auto-approve
          working-directory: ./terraform

        - name: Install kubectl
          run: |
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
            chmod +x kubectl
            sudo mv kubectl /usr/local/bin/

        - name: Update kubeconfig
          run: aws eks update-kubeconfig --name your-cluster-name --region us-east-1

        - name: Deploy to EKS
          run: |
            kubectl apply -f k8s/inter-frontend-deployment.yaml
            kubectl apply -f k8s/inter-frontend-service.yaml
            kubectl apply -f k8s/inter-backend-deployment.yaml
            kubectl apply -f k8s/inter-backend-service.yaml

     ```
