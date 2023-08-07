FROM mysql

RUN apt-get update && apt-get install -y \
    python3.11.3 \
    python3-pip

RUN pip3 install pymysql

ADD init.sql /docker-entrypoint-initdb.d

ENV MYSQL_USER=root
ENV MYSQL_PASSWORD= 
ENV MYSQL_DATABASE=face_recognition
ENV MYSQL_ROOT_PASSWORD=

EXPOSE 3306