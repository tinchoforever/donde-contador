'use strict';

/**
 * @ngdoc function
 * @name houstonDiversityMap:controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the houstonDiversityMap
 */
angular.module('dondeDataVizApp').controller('HomeCtrl', function (moment, $interval, $scope,$timeout,$document,$http) {


      var server = 'https://staging-donde.com.ar/';

     



	   var displayTime = function(){

   			$scope.diffDays = moment.utc([2017, 6, 18, 0, 0, 0, 0]);
   			//Solo hoy
   			var m = moment().utcOffset(-60*1);
   			$scope.diffHours = moment.utc([2017, m.month(),m.date()+1, m.hour(), 59, 59, 0]);	
   			$scope.diffMinutes = moment.utc([2017, m.month(), m.date(), m.hour()+1, 59, 59, 0]);	
   			$scope.diffSeconds=  moment.utc([2017, m.month(), m.date(), m.hour()+1,  m.minute(), 59, 0]);	
   		};


   		$interval(displayTime,1 * 1000);

   		var getStats = function(){
             $http.get(server + 'api/v2/evaluacion/stats/argentina')
               .then(function(d){
                  $scope.stats = d.data;
                  $scope.provincias = d3.entries(d.data.placesCountArray).map(function(d){return d.value.nombreProvincia});
                  $scope.stats.percentage =  d.data.totalEvaluatedPlaces * 100 / d.data.totalPlaces;
                  

                  for (var i = 0; i < $scope.stats.placesCountArray.length; i++) {
                     var prov = $scope.stats.placesCountArray[i];
                     if (prov.nombreProvincia){
                     var key = prov.nombreProvincia.trim().split(' ').join('_');
                     prov.key = key;
                        d3.select('path#' + key)
                           .attr("class", "st1 active")
                           .style("fill-opacity",prov.porcentaje/100);



                       (function(k){
                         d3.select('path#' + k)
                             .on('click', function(){
                                 
                                 $scope.setActive(k);
                                 d3.selectAll('svg path.st1')
                                       .attr("class", "st1 active");
                                 d3.select('path#' + k)
                                     .attr("class", "st1 active highlight");
                                 });

                       })(key);
                     }
                  };


                  var current = Math.floor(Math.random() * $scope.provincias.length -1) + 0 ;
                  $scope.active = $scope.stats.placesCountArray[current];

                  $scope.active.total = $scope.active.countEvaluatedPlaces + $scope.active.countNotevaluatedPlaces;
                  $scope.share=false;



               });
   			
   			
   		};
   		$interval(getStats,60 * 1000);
	     
        getStats();

        $scope.showShare = function(){
         $scope.share= true;
        }
        $scope.closeShare = function(){
         $scope.share= false;
        }

        $scope.setActive = function(k){
            for (var i = 0; i < $scope.stats.placesCountArray.length; i++) {
               var p = $scope.stats.placesCountArray[i];
               if (p.key === k){
                  $scope.$apply(function(){
                     $scope.active = p;
                     $scope.active.total = $scope.active.countEvaluatedPlaces + $scope.active.countNotevaluatedPlaces;
                     $scope.share=false;
                  });
                  break;
               }
               
            };

        }
});
