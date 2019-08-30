# easy_poll
A polling web service for professors.

This tool let professors create interactively nice polls, export and view the results.

## Features:
* Easy-to-use front-end
* Export results as .csv files (compatible with Excel, LibreOffice Calc, …)
* Administrator accounts, student accounts
* Prevent students from answering twice
*

## Requirements:
You need to install Node.js v0.10 (see https://nodejs.org/) and mongodb (see https://www.mongodb.org/) as well as a python2 distribution (https://python.org)

**Optional**: install git (https://git-scm.com/).

## Install (Linux, command line users)
First, get a copy of the software:

```bash
# Go to the directory where you want to install it
cd /path/to/install/directory

# Get a copy of the software
git clone https://github.com/cphyc/easy_poll.git

# if you don't have git, you can do the three following steps:
wget https://github.com/cphyc/easy_poll/archive/master.zip
unzip master.zip
mv easy_poll-master easy_poll

# Get into the newly installed directory
cd easy_poll

# Install dependencies automatically
npm install
```

## Install (other platform)
This has *not* been tested until now. Post a pull-request [here](https://github.com/cphyc/easy_poll/pulls).

## Configure
Open the file `server/config/local.env.sample.js`.
- Replace `DOMAIN`'s value (http://localhost:9000) by your domain name (for example: http://mydomain.com).
- Replace `SESSION_SECRET` by some random value (for example [here](https://duckduckgo.com/?q=random+password&ia=answer)).
- If you want to enable login through google accounts, change `GOOGLE_ID` and `GOOGLE_SECRET` to match your google credentials.
- Replace `ROOTS` by a comma-separated list of objects (objects are delimited by '{}') containing a name, a password and an optional email address.


### Extra configurations
You can pass extra configurations to the server using environment variables. Here is a list of environment variables you can change:
- `PORT` the port on which to serve (defaults to 9000)
- `IP`: ip to accept connections froms (default to 0.0.0.0, serve only from local)
- `GOOGLE_ID`: google login id (same as in previous paragraph)
- `GOOGLE_SECRET`: google login secret key


## Start the server
In the command line, go into the install directory and start the server:

```bash
cd /path/to/install/directory/easy_poll

# Do this if you want to test
grunt serve
# Do this if you want to use it
grunt serve:dist
```

The server should start. You can then access it at <http://localhost:9000/>.

# Remarks
Is is not advised to serve directly for the Internet. Instead, you'd rather serve it through a webserver (Apache, nginx). Here is a sample configuration for Apache with the application served on port 9000

```apache
<VirtualHost *:80>
	ServerAdmin <ADMIN MAIL>
	ServerName <URL OF THE SITE>

	ProxyPass / http://localhost:9000/
	ProxyPassReverse / http://localhost:9000/

	#Logfiles
	ErrorLog <PATH/TO/ERROR/LOGS/errors.log>

</VirtualHost>
```

You can then access your site at `<URL OF THE SITE>`.

# License
The program is provided under the GNU Lesser Leneral Public License. See the LICENSE file for more information.
