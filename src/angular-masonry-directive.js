(function() {
    "use strict";

    angular.module('masonry', ['ng']).directive('masonry', function($timeout) {
        return {
            restrict: 'AC',
            priority: -10,
            link: function(scope, elem, attrs) {
                var container = elem[0];
                var options = angular.extend({
                    itemSelector: '.item'
                }, angular.fromJson(attrs.masonry));

                var masonry = scope.masonry = new Masonry(container, options);

                var debounceTimeout = 0;
                scope.update = function() {
                    if (debounceTimeout) {
                        $timeout.cancel(debounceTimeout);
                    }
                    debounceTimeout = $timeout(function() {
                        debounceTimeout = 0;

                        masonry.reloadItems();
                        masonry.layout();
    
                        elem.children(options.itemSelector).css('visibility', 'visible');
                    }, 120);
                };
                
                scope.removeBrick = function() {
                    $timeout(function() {
                        masonry.reloadItems();
                        masonry.layout();
                   }, 500);
                };                
                
                scope.appendBricks = function(ele) {
                    masonry.appended(ele);
                };                
                
                scope.$on('masonry.layout', function() {
                    masonry.layout();                 
                });
                
                scope.update();
            }
        };
    }).directive('masonryTile', function() {
        return {
            restrict: 'AC',
            priority: -10,
            link: function(scope, elem) {
                elem.css('visibility', 'hidden');
                var master = elem.parent('*[masonry]:first').scope(),
                    update = master.update,
                    removeBrick = master.removeBrick,
                    appendBricks = master.appendBricks;
                scope.$watch(function(){ return elem[0].innerHTML }, function(val){
                    if (update) {
                        imagesLoaded( elem[0], update);
                        elem.ready(update);
                    }
                    if (appendBricks) {
                        imagesLoaded( elem[0], appendBricks(elem));
                    }
                });
                scope.$on('$destroy', function() {
                    if (removeBrick) {
                        removeBrick();
                    }
                });                
            }
        };
    });
})();
