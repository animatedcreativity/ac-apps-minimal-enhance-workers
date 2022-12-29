exports = module.exports = function() {
  var mod = {
    start: function() {
      app.workers = {
        index: 0,
        list: {},
        task: function(callback, taskName) {
          app.workers.index += 1;
          app.workers.list[app.workers.index] = {taskName: taskName, callback: callback};
        },
        count: function(taskName) {
          var count = 0;
          for (var index in app.workers.list) {
            var item = app.workers.list[index];
            if (item.name === taskName) count += 1;
          }
          return count;
        },
        do: async function(taskName) {
          return new Promise(function(resolve, reject) {
            for (var index in app.workers.list) {
              (async function(index) {
                var item = app.workers.list[index];
                if (taskName === item.taskName) {
                  await item.callback();
                  delete app.workers.list[index];
                  if (app.workers.count(taskName) <= 0) resolve(true);
                }
              })(index);
            }
          });
        }
      };
    }
  };
  mod.start();
  return mod;
}