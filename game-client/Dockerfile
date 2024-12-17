FROM node:lts
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "serve"]