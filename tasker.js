;
var Tasker = {};

(function() {

    var options = {
        timeout: 1000, // default time after which callbacks will be runed
        tick: 10 // time of refresh data
    };
    var isWorking = false;
    var tasks = {};
    var taskObject = function() {
        return {
            name: '',
            callback: function() {},
            time: 1000,
            params: [],
            namespace: document
        };
    };

    /**
     * Set params
     * @param {[object]} args
     */
    function setOptions(args) {
        if (args && typeof args != 'object') {
            throw 'Options must be an object type!';
        }

        for (var key in args) {
            options[key] = args[key];
        }
        return true;
    }

    Tasker.setOptions = setOptions;


    /**
     * Add task which must be done!
     * @param {[string]}   name     name of the task
     * @param {Function} callback function which must be called 
     * @param {[object]}   namespace   namespace with what task will be called
     * @param {[array]}   params   parrrams which must be set to called function
     */
    function addTask(name, callback, namespace, params, newTime) {
        if (typeof name != 'string' || typeof callback != 'function') {
            throw 'Name variable must be string and callback must be a function.';
            return;
        }

        if (typeof tasks[name] == 'object') {
            updateTask(name, newTime);
        } else {
            insertTask(name, callback, namespace, params, newTime);
        }

        // Runt tasks if it not still works
        if(!isWorking) {
        	isWorking = true;
        	circleOfLife();
        }
    };

    Tasker.addTask = addTask;

    /**
     * update time of the task if it runed one more time too earlier
     * @param  {string} name [name of the task]
     */
    function updateTask(name) {
        tasks[name].time = options.timeout;
    };


    /**
     * [Add new Task]
     * @param  {[string]}   name     [Name of the task]
     * @param  {Function} callback [Function which must be called after time expland]
     * @param  {[array]}   params   [Array of params which must be seted to the called function]
     */
    function insertTask(name, callback, namespace, params) {
        var task = new taskObject();
        task.name = name;
        task.callback = callback;
        task.time = options.timeout;
        task.namespace = namespace;
        task.params = params || [];

        tasks[name] = task;
    };

    /**
     * [When the time is up we call the task]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    function runTask(name) {
        var task = tasks[name];
        task.callback.apply(task.namespace, task.params);
    };

    /**
     * [Method which remove the task when it's done]
     * @param  {[string]} name [Name of the task]
     */
    function removeTask(name) {
        delete tasks[name];
    };

    /**
     * [Method which decrease time of each task]
     */
    function circleOfLife() {
        var tick = options.tick;
        setTimeout(function() {
            for (var key in tasks) {
                var task = tasks[key];
                task.time -= tick;
                if (task.time <= 0) {
                    runTask(key);
                    removeTask(key);
                }
            };
            // Lets rerun it only if we have a tasks.
            if (Object.keys(tasks).length) {
                circleOfLife();
            } else {
            	isWorking = false;
            }
        }, tick);
    };
})();
