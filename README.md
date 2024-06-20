# RedditLike.js

[![Next][Next.js]][Next-url]
[![NestJS][NestJS]][NestJS-url]
[![MIT License][license-badge]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">RedditLike.js</h3>

  <p align="center">
    Create your own Reddit like Website with Javascript
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <!-- <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a> -->
  </p>
</div>


## Pre-requisite

### 1. Install [node.js(>20)](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

### 2. Install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/)
 - Make sure user is in docker group with below command(to run docker without sudo)
 ```
 sudo usermod -aG docker $USER
 ```


</br>

## Features

- Reddit-like board-post-comment structure
- Board managing page
- Feature-Rich Text Editor
- Real-time chat(1:1, Group) support

<br/>
<br/>


## Quick Start


### Running a backend server with Docker
* Setup db and backend environment configuration
```bash
cd envs;
cp .env.db.sample .env.db;
cp .env.backend.sample .env.backend;
cd ..

```

* Start DB and Backend server with docker-compose up
```bash
docker-compose up
```

If backend server is successfully launched, your console log will show following message
```
redditlike-back  | [Nest] 29  - 06/20/2024, 10:07:18 AM     LOG [NestApplication] Nest application successfully started +4ms
redditlike-back  | Server is running on http://localhost:3030
```

<br/>

### Running a frontend server(Manual)

- Setup frontend environment

```bash
cd frontend;
cp .env.sample .env;
```

- Build docker image with docker command

```bash
docker build  -t ${USER}/redditlike-front .
```

- Then run container

```bash
docker run -p 3010:3010 --name redditlike-front ${USER}/redditlike-front
```



Then if console shows this message, you are done!
```
  ▲ Next.js 13.5.6
  - Local:        http://localhost:3010
  - Network:      http://0.0.0.0:3010

 ✓ Ready in 39ms
```










<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/
[license-badge]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
