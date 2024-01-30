FROM node:20


# Set working directory
WORKDIR /var/www

# Install dependencies
COPY package*.json ./

# Copy app source code
COPY . .

# Build app
RUN npm install -g pnpm
RUN npm install -g supervisor

RUN pnpm install

# Expose port
EXPOSE 3333

# Start app
CMD [ "pnpm", "run", "watchserver" ]

