FROM node as builder
WORKDIR /usr/src/app
COPY ./ ./
RUN  yarn
RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 8521

CMD ["nginx", "-g", "daemon off;"]