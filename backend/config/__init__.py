import pymysql

# Make PyMySQL pretend to be mysqlclient so Django accepts it
pymysql.version_info = (2, 2, 1, "final", 0)
pymysql.install_as_MySQLdb()