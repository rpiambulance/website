**Note:** This repo was previously forked from [wtg/ambulance](https://github.com/wtg/ambulance), but was removed from the fork network by GitHub Support. The former repository is no longer developed, leaving this repo as the most up-to-date version.

Installation and Running the Site
---

This website is built in the MEAN stack (MongoDB, Express.js, Angular.js, and Node.js), and can be deployed using the following steps:

1. Clone this git repository by running the following command in a Git-enabled terminal:
    * `> git clone https://github.com/rpiambulance/website.git ambulance`

2. Navigate into the directory of the application:
    * `> cd ambulance`

3. If NodeJS and Bower are both installed on your computer, skip this step.
    * Install NodeJS [here](https://nodejs.org/en/download/).
    * Install Bower through Node Package Manager (npm) by running: `npm install -g bower`.

4. Install all necessary dependencies by running the following commands:
    * `> bower install`

5. Install [mysql](https://www.mysql.com/) and then:
    * Run the sql located in the file [.docker/mysql/schema.sql](.docker/mysql/schema.sql) to create database (`ambulanc_web`) and necessary tables in the DB
    * [ADD INSTRUCTIONS FOR ADDING MEMBER, DEFAULT CREWS]

6. Install PHP and a webserver (Apache, Nginx) to run it

Development
---

The site uses [Docker](https://www.docker.com/) to spin up three containers to ease in development which consists of:
* MySQL container
* PHP + Apache container
* phpMyAdmin container

To use this, you will need to install docker and docker-compose. For Windows and MacOS, it's recommended to
install the [Docker Desktop](https://www.docker.com/products/docker-desktop) which contains everything that you
need. For a Linux distro, find your OS and follow the install directions for it on
[this page](https://docs.docker.com/install/). You may need to additionally follow the instructions
[this page](https://docs.docker.com/compose/install/) to install docker-compose.

Once that is done, you just need to run the following command anytime you want to work on the site:
```
docker-compose up
```

This starts all three containers, links them together, and makes them accessible on your localhost. The containers
have the following access points on the host machine:
* Site: http://localhost:8080
* phpMyAdmin: http://localhost:8081
* MySQL: localhost:33060
This will setup the necessary `.{admin,db,form}_config.php` files in your site directory. Additionally, when you first
start the MySQL container, it will create a user with the following credentials that you can use to login:
* Username: test
* Password: test

Deployment
---

The site is deployed live through the use of [Travis-CI](https://travis-ci.com) with all builds being
available at https://travis-ci.org/rpiambulance/website. This allows keeping the live site in sync
with the code in the repo automatically and without any human intervention, except to keep
Travis-CI working, and to occasionally rotate the credentials listed below.

On any pushes to master, Travis-CI will kick off a
[deploy script](https://github.com/rpiambulance/website/blob/master/.travis/deploy.sh)
which connects to the RPI VPN network, and then uses rsync to push files from the repo
to the Union FTP server, where the site is hosted. To do this, it uses five secret
variables that are set on Travis-CI under settings for the repo:
* RPI_FTP_USERNAME
* RPI_FTP_PASSWORD
* RPI_VPN_USERNAME
* RPI_VPN_PASSWORD
* RPI_VPN_SECRET

The first two variables are used for accessing the Union FTP server. The next three
variables deal with logging into RPI's VPN network. The username and password should
be the RCS credentials of a current student (preferably the current webmaster's) while
the value for the secret can be found at https://afsws.rpi.edu/AFS/dept/cct/public/vpnc/
after logging in. These are then used to configure the vpnc to connect to RPI network,
following a similar setup as outlined on the
[DotCIO Linux VPN instructions](https://dotcio.rpi.edu/services/network-remote-access/vpn-connection-and-installation/using-vpnc-open-source-client).

-----------------------------------------------------

### Credits

This project was created for the RPI Ambulance organization by the [Web Technologies Group](http://stugov.union.rpi.edu/senate/projects/wtg).

#### Developers
* [Dan Bruce](http://github.com/ddbruce)
* [Justin Etzine](http://github.com/justetz)
* [John Jacangelo](https://github.com/jcub)
* [Matthew Peveler](https://github.com/MasterOdin)
* [Logan Ramos](https://github.com/lramos15)
* [David Sparkman](http://github.com/David-Sparky)


#### Copyrights
* Select photos are copyrighted by David Sparkman and are used with permission from the author.
* Some photos are copyrighted by Michael Cuozzo and used with permission from the author.

For more information regarding copyrighted works herein contained, please contact dev@rpiambulance.com or officers@rpiambulance.com
