# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# # Expose app port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
