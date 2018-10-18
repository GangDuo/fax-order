var nodemailer = require("nodemailer");

(() => {
  var xs = [process.env.SMTP_HOST || "",
            process.env.SMTP_AUTH_USER || "",
            process.env.SMTP_AUTH_PASS || "",
            process.env.EMAIL_ADDRESS_SENDER || ""];
  // 環境変数なし
  if(!xs.every((a) => a.length > 0)) {
    return;
  }

  //SMTPサーバの設定
  var smtp = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
      }
  });

  //メール情報の作成
  var message = {
      from: process.env.EMAIL_ADDRESS_SENDER,
      to: process.env.COMMA_SEPARATED_EMAIL_ADDRESS_RECIPIENTS_CC.split(','),
      subject: 'nodemailer test mail',
      text: 'test',
      attachments: [
        {
          filename: '発注書.pdf',
          path: '/mail-feed/fmww.pdf'
        }
      ]
  };

  // メール送信
  try{
      smtp.sendMail(message, function(error, info){
          // エラー発生時
          if(error){
              console.log("send failed");
              console.log(error.message);
              return;
          }
          
          // 送信成功
          console.log("send successful");
          console.log(info.messageId);
      });
  }catch(e) {
      console.log("Error",e);
  }
})();
