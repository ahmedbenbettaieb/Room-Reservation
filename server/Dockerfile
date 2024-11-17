# Use an official PHP image with Apache
FROM php:7.4.29-apache

# Install system dependencies and PHP extensions required for Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip \
    && a2enmod rewrite

# Set working directory in the container
WORKDIR /var/www/html

# Copy the composer.json and composer.lock first to take advantage of Docker caching
COPY composer.json composer.lock ./

# Install Composer (PHP package manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Now copy the rest of your Laravel application code (including artisan, .env, etc.)
COPY . .

# Install Laravel project dependencies via Composer
RUN composer install --no-dev --optimize-autoloader


# Set proper permissions for storage and cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose the port Apache is running on
EXPOSE 80

# Command to run Laravel's development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
