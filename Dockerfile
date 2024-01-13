FROM node:18

WORKDIR /app

COPY package.* ./

RUN yarn install

RUN yarn global add gatsby-cli

COPY . .

EXPOSE 8000

CMD ["yarn", "run", "develop", "--host", "0.0.0.0"]