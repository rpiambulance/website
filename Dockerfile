FROM php:7.2-apache

COPY . /var/www/html

WORKDIR /var/www/html

RUN rm -rf libs \
    && rm -rf vendor \
    && rm -rf .docker \
    && rm -rf .travis \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        sudo \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g bower \
    && docker-php-ext-install pdo pdo_mysql \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php -r "if (hash_file('sha384', 'composer-setup.php') === 'a5c698ffe4b8e849a443b120cd5ba38043260d5c4023dbf93e1558871f1f07f58274fc6f4c93bcfd858c6bd0775cd8d1') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && chmod +x composer.phar \
    && mv composer.phar /usr/local/bin/composer \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/www/.config \
    && chown www-data:www-data /var/www/ \
    && chown www-data:www-data /var/www/.config \
    && sudo -u www-data /bin/bash -c "bower install --production" \
    && sudo -u www-data /bin/bash -c "composer install --no-dev --optimize-autoloader"
