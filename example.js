var klyng = require('klyng');

function main() {
    if(klyng.rank() === 0) {
      var list = new Array(3000);
      for (var i = 0; i < list.length; ++i) {
        list[i] = 5;
      }

      var portionSize = Math.floor(list.length / klyng.size());
      var promises = [];
      for(var p = 1; p < klyng.size(); ++p) {
          promises.push(sendRank(klyng, p, list.slice((p - 1) * portionSize, p * portionSize)));
      }
      var sum = processData(list.slice((klyng.size() - 1) * portionSize, list.length));
      for(var p = 1; p < klyng.size(); ++p) {
        promises.push(recieveResults(klyng, p));
      }
      Promise.all(promises)
        .then(values => {
          values = values.filter(v => {return v});
          log('values => ' + values.join(', '));
          log(`The sum is ${values.reduce((prev, next) => prev + next)}`);
          klyng.end();
        })
        .catch(err => {
          log(`${klyng.rank()}, error => ${err.stack}`);
          klyng.end();
        });
    } else {
      receiveTask(klyng)
        .then(doBadWork)
        .then(sendTaskResults)
        .then(klyng.end)
        .catch(err => {
          log(`${klyng.rank()}, error => ${err.stack}`);
          klyng.end();
        });
    }
}

function processData (portion) {
  return portion.reduce((prev, next) => prev + next);
}

function receiveTask (klyng) {
  return new Promise ((resolve, reject) => {
    log(`${klyng.rank()} waiting for task`)
    var data = klyng.recv({from: 0});
    log(`${klyng.rank()} recieved task`);
    resolve({ klyng, data });
  });
}

function doBadWork (input) {
  return new Promise ((resolve, reject) => {
    let iters = Math.floor(Math.random() * 1000000000)
    log(`${input.klyng.rank()} starts iterating => ${iters}`);
    for (var i = 0; i < iters; ++i) { var m = Math.random(); }
    log(`${input.klyng.rank()} ends iterating and is sending task`);
    resolve(input);
  })
}

function sendTaskResults (input) {
  return new Promise ((resolve, reject) => {
    log(`${input.klyng.rank()} starts sending task to 0`);
    input.klyng.send({to:0 , data: processData(input.data) });
    log(`${input.klyng.rank()} sent task`);
    resolve();
  });
}

function recieveResults (klyng, rank) {
  return new Promise ((resolve, reject) => {
    log(`\tlistening for ${rank}`);
    var partialSum = klyng.recv();
    log(`\t${rank} return recieved`);
    resolve(partialSum);
  })
}

function sendRank (klyng, rank, portion) {
  return new Promise ((resolve, reject) => {
    log(`\tprepare to send portion to => ${rank}`);
    klyng.send({to: rank, data: portion});
    log(`\tsent portion to => ${rank}`);
    resolve();
  })
}

function log (str) {
  var now = new Date();
  console.log(`[${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}] ${str}`);
}

klyng.init(main);