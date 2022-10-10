
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ghogharinikunj97@gmail.com',
            pass: 'tjgjgbpgzsujdnsi'
        }
    });

    function between(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      }
      var otp = between(100000, 999999);

      var mailOptions = {
        from: 'ghogharinikunj97@gmail.com',                   // sender's gmail
        to: req.body.Email ,                  // receiver's gmail
        subject: 'one time otp',     //subject
        text: `${otp}`                      //message Description
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });