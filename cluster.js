var klyng = require('klyng');

function main() {
  var runner;
    if(klyng.rank() === 0) {
      runner = require('./src/main');
      runner.run(klyng);
    } else {
      runner = require('./src/helper');
      runner.run(klyng)
      .then(() => {
        console.log('Ending work for rank => ' + klyng.rank());
        klyng.end();
      });
    }
}

klyng.init(main);