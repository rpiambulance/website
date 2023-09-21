FROM php:7.2-apache

ARG build_env=production

COPY . /var/www/html

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        sudo \
        unzip \
        zip \
        gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_16.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g bower \
    && docker-php-ext-install pdo pdo_mysql \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && mv "${PHP_INI_DIR}/php.ini-${build_env}" "${PHP_INI_DIR}/php.ini" \
    && chmod +x composer.phar \
    && mv composer.phar /usr/local/bin/composer \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/www/.config \
    && chown www-data:www-data /var/www/ \
    && chown www-data:www-data /var/www/.config \
    && sudo -u www-data /bin/bash -c "bower install --production" \
    && sudo -u www-data /bin/bash -c "composer install --no-dev --optimize-autoloader"
