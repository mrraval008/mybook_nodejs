const nodemailer = require('nodemailer');
const fs = require('fs')

let transport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGIRD_USERNAME,
      pass: process.env.SENDGRID_PASSWORD
    }
  })

let fromEmail = process.env.EMAIL_FROM;

class Email {
    constructor(user,url){
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
    }

    async send(templateName,subject){

        let html = fs.readFileSync(`${__dirname}/../templates/email/${templateName}.html`,'utf-8')
        html = html.replace('#name',this.firstName).replace("#url",this.url);

        const msg = {
            from: fromEmail,
            to:this.to,
            subject: subject,
            html
        }
        await transport.sendMail(msg,function(err, info){
            if (err){
              console.log(err);
            }
            else {
              console.log('Message sent: ' + info.response);
            }
          })
    }

    sendWelcome(){
        this.send('welcome',"Welcome to MyBook family")
    }

    sendPasswordReset(){
        this.send('passwordReset','MyBook - Your Password Reset Token {Valid for only 10 minutes}')
    }
}

module.exports = Email