FROM nginx

RUN mkdir /nginx
COPY ./dist /nginx
COPY ./huashida.conf /etc/nginx/conf.d
