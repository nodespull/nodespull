


export function appDockerfile(){

    let rootFile_name:string = process.argv[1].split("/").pop()!;

    return `FROM node:10

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

CMD ["node","src/${rootFile_name}","run","--dev"]

COPY . .
`
}

export function heroku_db_dockerfile(){
    return `FROM mysql
CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]

ENV MYSQL_DATABASE=nodespull-db-database
ENV MYSQL_ROOT_PASSWORD=nodespull-db-password

CMD ["echo", "\"${get_my_dot_cnf()}\"", ">", "etc/my.cnf"]

`
}




function get_my_dot_cnf(){
    return`[client-server]\\nsocket=/tmp/mysql-dbug.sock\\nport=80\\n[client]\\npassword=my_password\\n[mysqld]\\ntemp-pool\
    \\nkey_buffer_size=16M\\ndatadir=/my/mysqldata\\nloose-innodb_file_per_table\\n[mariadb]\\ndatadir=/my/data\
    \\ndefault-storage-engine=aria\\nloose-mutex-deadlock-detector\\nmax-connections=20\\n[mariadb-5.5]\
    \\nlanguage=/my/maria-5.5/sql/share/english/\\nsocket=/tmp/mysql-dbug.sock\\nport=80\\n[mariadb-10.1]\
    \\nlanguage=/my/maria-10.1/sql/share/english/\\nsocket=/tmp/mysql2-dbug.sock\\n[mysqldump]\\nquick\\nmax_allowed_packet=16M\
    \\n[mysql]\\nno-auto-rehash\\nloose-abort-source-on-error`
}