# amazon-bedrock-coding-coach
This is AI coding coach use  amazon bedrock foundation model 


[<img src="https://i.ytimg.com/vi/Hc79sDi3f0U/maxresdefault.jpg" width="50%">](https://vimeo.com/879129321 "CodeCoach Demo")


[![Little red riding hood](https://i.stack.imgur.com/XCRlR.png)](https://vimeo.com/3514904 "Little red riding hood - Click to Watch!")


## Install 

1. require: amazon bedrock claue access permession (we strong recommand use EC2 role)

2. start ec2 , amazon linux 2023, m5.large

3. install nodejs, yarn ,docker 

   ```bash
    sudo yum install nodejs.x86_64 git docker
    sudo systemctl start docker
    sudo usermod -aG docker ec2-user  #need relogin 
    sudo npm install yarn -g
   
    git clone https://github.com/stevensu1977/amazon-bedrock-coding-coach.git
   
    cd amazon-bedrock-coding-coach


    yarn
    
    #修复piston-client 没有带application/json
    yarn add git+https://github.com/stevensu1977/node-piston

   ```
4. install piston, docker-compose 
   we use piston as code exectutor

   ```bash
   

   python3 -m venv .venv
   . .venv/bin/activate
   pip install docker-compose

   

   git clone https://github.com/engineer-man/piston.git

   docker-compose up -d api

   cli/index.js --piston-url http://127.0.0.1:2000  ppman install python=3.10.0

   ```
