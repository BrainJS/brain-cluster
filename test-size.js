var klyng = require('klyng');
var fs = require('fs');

function main() {
  const allAtOnce = false;
  let opts = {
    klyng,
    to: ((klyng.rank() + 1) % klyng.size()),
    file: `./sendSizes/rank-${klyng.rank()}-of-${klyng.size()}-${(allAtOnce) ? 'all-at-once' : 'not-all-at-once'}.txt`,
    allAtOnce: allAtOnce
  };
  
  try {
    if (opts.allAtOnce) {
      opts['data'] = [Math.pi];
      sendTask(opts) 
    } else {
      if (klyng.rank() === 0) {
        opts['data'] = [Math.pi];
        sendTask(opts);
      } else {
        receiveTask(opts);
      }
    }
  } catch (err) {
    console.log(err)
    klyng.end();
  }
}

function sendTask(opts) {
  console.log(`>> ${opts.klyng.rank()} - sending data to ${opts.to} of length ${opts.data.length}`);
  opts.klyng.send({
    to: opts.to,
    data: opts.data
  })
  receiveTask(opts);
} 

function receiveTask (opts) {
  var time = new Date();
  const result = opts.klyng.recv();
  var str = `${(opts.allAtOnce) ? 'All At Once' : 'NOT All At once'}, msg length => ${result.length}`;
  opts.data = result.concat(result);
  if (!fs.existsSync('./sendSizes')){
    fs.mkdirSync('./sendSizes');
  }
  fs.writeFileSync(opts.file, str)
  opts.data = result.concat(result);
  console.log(opts.klyng.rank() + ' calling sendTask(opts)');
  sendTask(opts);
}

klyng.init(main);