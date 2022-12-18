FROM node:16-alpine As development

WORKDIR /app

COPY package*.json ./
# COPY load-extensions.sh /docker-entrypoint-initdb.d/
COPY . .


# EXPOSE 3000
# EXPOSE 5432

CMD ["npm", "run start:dev"]