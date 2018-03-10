# brain-cluster
Getting brain to train in parallel (on many machines or on many threads).

# Getting Started
This uses [klyng](https://www.npmjs.com/package/klyng) which is also built on [fibers](https://www.npmjs.com/package/fibers).

Get `klyng` installed globally:
```
yarn global add klyng
```

`klyng` by default runs a _beacon_ on port `:2222`.  You can change the port and add a password in the config file.  If you ran the above command it is found here by default `~/.config/yarn/global/node_modules/klyng/config.json`.

There is also the `machine.json` which describes how communication on the cluster will perform.


# Scripts

#### down
```
yarn down
```
Shuts down the klyng beacon. You shouldn't have to do this unless you are running a bunch of klyng commands at once and it things start breaking and it isn't handled nicely

#### up
```
yarn up
```
Starts the klyng beacon. If running a klyng script and the beacon isn't up you shouldn't need to do that.  This might need to be done manually when running on secondary machines.

#### start
```
yarn start
```
Start `cluster.js`  Currently configured in the `packages.json` to start 6 local processses.  Currently hard coded to train a network in solving the [likely](https://github.com/BrainJS/brain.js/blob/develop/test/base/likely.js) problem.  As this gets flushed out there will be better documentation and integration with `brain.js` directly.

#### cluster
```
yarn cluster
```
will start `cluster.js` but will also apply the `machines.json`  This is just in reference to how to run on a cluster, but hasn't been flushed out yet (also the machines.json doesn't mean anything at this point)

#### example
```
yarn example
```
starts a trivial example, used for concept testing on klyng.  This will get removed eventually but is still useful in testing out specific functionality

#### test-sizes
```
yarn test-sizes
```
Like example this is used for testing specifically how large of a data set we can send back and forth from klyng instances.  The documentation on klyng isn't stellar so this was a semi-stress test.  This will also be removed as `brain-cluster` matures


