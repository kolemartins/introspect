/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Topic from '../api/topic/topic.model';

Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Babel, Karma, ' +
      'Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, ' +
      'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, ' +
      'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep ' +
      'tests alongside code. Automatic injection of scripts and ' +
      'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more ' +
      'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript ' +
      'payload, minifies your scripts/css/images, and rewrites asset ' +
      'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku ' +
      'and openshift subgenerators'
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
        provider: 'local',
        fname: 'Test',
        lname: 'User',
        email: 'test@example.com',
        password: 'test',
        cell: '512-694-4632',
        role: 'user',
        confirmed: true,
        manager: 'michael.stanley@gmail.com'
      }, {
        provider: 'local',
        fname: 'Michael',
        lname: 'Stanley',
        email: 'michael.stanley@gmail.com',
        password: 'admin',
        cell: '512-694-4632',
        role: 'admin',
        confirmed: true,
        manager: 'michael.stanley@gmail.com'
      }, {
        provider: 'local',
        fname: 'Elysha',
        lname: 'Stanley',
        email: 'michael.stanley@gmail.com',
        password: 'admin',
        cell: '512-694-4632',
        role: 'admin',
        confirmed: true,
        manager: 'michael.stanley@gmail.com'
      }, {
        provider: 'local',
        fname: 'Taylor',
        lname: 'Stanley',
        email: 'michael.stanley@gmail.com',
        password: 'admin',
        cell: '512-694-4632',
        role: 'admin',
        confirmed: true,
        manager: 'michael.stanley@gmail.com'
      }, {
        provider: 'local',
        fname: 'Jack',
        lname: 'Stanley',
        email: 'michael.stanley@gmail.com',
        password: 'admin',
        cell: '512-694-4632',
        role: 'admin',
        confirmed: true,
        manager: 'michael.stanley@gmail.com'
      })
      .then(() => {
        console.log('finished populating users');
      });
  });


Topic.find({}).remove()
  .then(() => {
    Topic.create(
     {
        name: 'Chores',
        description: 'Chores.',
        active: true
      }, {
        name: 'Sports',
        description: 'Sports.',
        active: true
      }, {
        name: 'Home',
        description: 'Home.',
        active: true
      }, {
        name: 'Shopping',
        description: 'Shopping.',
        active: true
      }, {
        name: 'Education',
        description: 'Education.',
        active: true
      }, {
        name: 'Misc',
        description: 'Misc.',
        active: true
      })
      .then(() => {
        console.log('finished populating topics');
      });
  });
