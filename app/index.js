var Nightmare = require('nightmare');
var Minio = require('minio')
var minioClient = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});
const bucketName = "yyyymmdd-orders";

var settings = {
  pageSize: 'A4',
  landscape: false, // 縦
  printBackground: true,
  marginsType: 0,
  timeout: 1000     // ms
};

var nightmare = Nightmare({show: true});
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
      .then(function(result) {
        console.log(result);
        resolve();
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
      .wait('body')
      .wait('#menu\\:0')
      .evaluate(() => {
        document.getElementById('menu:0').lastChild.click();
        document.getElementById('menu:2').firstChild.lastChild.click();
      })
      .then(function(result) {
        console.log(result);
        resolve();
      })
      .catch(function(error) {
        console.error(error);
        reject();
      });
  });
};

const filterorders = function(n) {
  return new Promise((resolve, reject) => {
    n
      .wait('#loading')
      .wait(function() {
        return document.getElementById('loading').style.display === 'none'; 
      })
      .evaluate(() => {
        document.getElementById('output').value = '1';
        var spans = document.querySelector("#sup_cd\\:SELECT").children
        for(i = 0; i < spans.length; ++i) {
          code = spans[i].value;
          if(code === '0610') {
            spans[i].setAttribute("selected", "selected");
            spans[i].className = "selected"
          }
        }
        document.getElementById('sup_cd').value = '0610';

        document.getElementById('search_button').click();
      })
      .then(function(result) {
        console.log(result);
        resolve();
      })
      .catch(function(error) {
        console.error(error);
        reject();
      });
  });
}

const checkorders = function(n) {
  return new Promise((resolve, reject) => {
    n
      .wait('#loading')
      .wait(function() {
        return document.getElementById('loading').style.display === 'none'; 
      })
      .evaluate(() => {
        var inputs = document.querySelectorAll('input[name=checkbox]');
        if(inputs.length > 1) {
          inputs[1].click();
          document.getElementById('execute_button').click();
        }
      })
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

const previeworders = function(n) {
  return new Promise((resolve, reject) => {
    n
      .wait('#loading')
      .wait(function() {
        return document.getElementById('loading').style.display === 'none'; 
      })
      .pdf('./fmww.pdf', settings)
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
}).then(() => {
  return filterorders(nightmare);
}).then(() => {
  return checkorders(nightmare);
}).then(() => {
  return previeworders(nightmare);
}).then(() => {
  var metaData = {
    'X-Amz-Meta-Testing': 1234,
    'example': 5678
  };
  minioClient.fPutObject(bucketName, Date.now().toString() + ".pdf", './fmww.pdf', metaData, function(err, etag) {
    return console.log(err, etag) // err should be null
  });
}).catch(function(error) {
  console.error(error);
});
