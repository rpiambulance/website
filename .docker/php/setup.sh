#!/usr/bin/env bash

array=( ".admin_config.php" ".db_config.php" ".form_config.php" )
for i in "${array[@]}"; do
  if [ ! -f "/var/www/html/${i}" ]; then
    cp /var/www/html/.docker/${i} /var/www/html
  fi
done

exec apache2-foreground