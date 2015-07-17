## Codescreen

Codescreen is a tool for administering coding challenges via git. It's designed for interview candidates.

You give each candidate a URL including a unique username and password. They use this url to clone a git repository. When that happens, you get an email to let you know they've started. Once they're done, they push the repo back to the server. You get an email to let you know they're finished and you can review their code.

### Properties:

* Candidate code never gets written to the original repository. This means candidates never see previous solutions, as with a branching model.
* The email notification lets you know how long a candidate spent on your challenge. This is critical information when evaluating candidate responses against one another.
* It's really simple for candidates. It's just git.
* It's really simple to run. There's no database to connect to, no external services. It's just a single process.

## Setup

```
git clone https://github.com/Prismatik/codescreen.git
cd codescreen
npm install
node index.js
```

Environment variables (all optional):
* CODESCREEN_SECRET: The secret key used to verify credentials. Set this.
* DOMAIN: The domain you're running the server on. Not necessary for operation, but enables some conveniences.
* PORT: Defaults to 7000
* EMAIL_USER: The username for the email account you want notifications sent from.
* EMAIL_PASS: The password for the email account you want notifications sent from.
* EMAIL_TO: The address you want notifications sent to.
* EMAIL_FROM: The address you want notifications to appear sent from.
* NODEMAILER_SERVICE: The email service you're using, as per [nodemailer-wellknown](https://github.com/andris9/nodemailer-wellknown#supported-services)

## Use

Generate your admin credentials:

`node genhash.js [SECRET] admin`

Substitute this has for the default, `b84f06c31dda856f`, used in the examples below.

Push a repo up to the server. First, generate credentials for the repo:

`curl http://admin:b84f06c31dda856f@localhost:7000/genCreds?username=myrepo&repo=myrepo`

You'll get back something like:

`http://myrepo:60a1c8ca8d2ec088@localhost:7000/myrepo`

Now cd to your repo and push it up:

```
git remote add codescreen http://myrepo:60a1c8ca8d2ec088@localhost:7000/myrepo
git push --set-upstream codescreen master
```

Now you're read to send it to candidates. Generate credentials for them:

`curl http://admin:b84f06c31dda856f@localhost:7000/genCreds?username=candidateOne&repo=myrepo`

Hand them over and wait or a  submission.
