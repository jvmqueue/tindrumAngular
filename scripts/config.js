requirejs.config({
    paths:{ // only load if AMD defines the alias as a dependency        
        "jQuery":["../node_modules/jquery/dist/jquery.min"],
        "bootstrap":["../node_modules/bootstrap/dist/js/bootstrap"],
        "angular":["../node_modules/angular/angular"],
        "http":["base/httpRequest"]
    },
    shim:{        
        'bootstrap':{
            deps:['jQuery']
        },
        'jQuery':{
            exports:'$'
        }
    },
    deps:['main', 'bootstrap', 'angular', 'http'] // where our program begins execution
});