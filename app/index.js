var Nightmare = require('nightmare');

var settings = {
  pageSize: 'A4',
  landscape: false, // 縦
  printBackground: true,
  marginsType: 1,
  timeout: 1000     // ms
};

var nightmare = Nightmare();
const signin = function(n) {
  return new Promise((resolve, reject) => {
    n
      .goto(process.env.FMWW_SIGN_IN_URL)
      .wait('body')
      .evaluate((arg) => {
        var inputs = document.getElementsByTagName('input');
        inputs[0].value = arg.FMWW_ACCESS_KEY_ID;
        inputs[1].value = arg.USER_NAME;
        inputs[2].value = arg.FMWW_SECRET_ACCESS_KEY;
        inputs[3].value = arg.PASSWORD;
        document.getElementById('form1:login').click();
        return 1;
      }, { FMWW_ACCESS_KEY_ID     : process.env.FMWW_ACCESS_KEY_ID,
           USER_NAME              : process.env.USER_NAME,
           FMWW_SECRET_ACCESS_KEY : process.env.FMWW_SECRET_ACCESS_KEY,
           PASSWORD               : process.env.PASSWORD })
      .wait('#scrollCtrl_mode')
      .title()
      .then(function(result) {
        console.log(result);
        resolve();;
      })
      .catch(function(error) {
        console.error(error);
        reject();
      });
  });
};

const mainmenu = function(n) {
  return new Promise((resolve, reject) => {
    n
      .wait('#scrollCtrl_mode')
      .pdf('./fmww.pdf', settings)
      .title()
      .end()
      .then(function(result) {
        console.log(result);
        resolve();;
      })
      .catch(function(error) {
        console.error(error);
        reject();
      });
  });
};

signin(nightmare).then(() => {
  return mainmenu(nightmare);
});
