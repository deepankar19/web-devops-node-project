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
     ```docker build -t devilvires/inter-frontend-app:01 .
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