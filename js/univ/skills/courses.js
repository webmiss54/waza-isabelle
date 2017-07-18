'use strict';

/* Controllers */

root.controller('AdminUnivSkillsCourses' ,['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
  
  $scope.node = null;
  $scope.graph = null;
  $scope.link = null;
  $scope.svg = null;
  
    $scope.buildCloudWord = function(){
        
        var keywords = $scope.keywords.reduce(function(stack,element){
            if(stack.hasOwnProperty(element)){
                stack[element] = stack[element]+1;
            }
            else stack[element] = 0;
            return stack;
        },{})
        
        var words = Object.keys(keywords).map(function(element){
            return  {text: element, weight: Math.min(200,10*keywords[element])}
        })
        
        words = words.sort(function(a, b){
            var keyA = a.weight,
                keyB = b.weigth;
            // Compare the 2 dates
            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        });
        words = words.slice(0,Math.min(words.length,250));

        console.log("words",words)
        $('#keywords').jQCloud(words);
        
    }
    $scope.initSkills = function(){
        var session = $scope._getSession();
        var data = {command:"getUniversityAllCoursesSkills",userSession:session.session,userId:session.user,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.skills = data.details;
                $scope.buildCloudWord();
            }
            else{
            }
        })
    }
    
    $scope.initKeywords = function(){
        var session = $scope._getSession();
        var data = {command:"getUniversityAllCoursesKeywords",userSession:session.session,userId:session.user,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.keywords = data.details;
                
            }
            else{
            }
            $scope.initSkills();
        })
        
    }
	
	$scope.initGraph = function(){
		var session = $scope._getSession();
        var data = {command:"getUniversityGraph",userSession:session.session,userId:session.user,universityId:$scope.campus.id};
        var promise = $http.post($scope._serverUrl,data);
        promise.success(function(data, status, headers, config) {
            if(data.status == "success"){
                $scope.courses = data.details;
                $scope.buildGraph();
            }
            else{
            }
            //$scope.initSkills();
        })
		
	}
	
	$scope.buildGraph = function(){
		
		$scope.graphWidth = 960,
		$scope.graphHeight = 500,
		
		$scope.courses.x0 =  $scope.graphWidth/2;
		$scope.courses.y0 = 50;

		$scope.force = d3.layout.force()
			.linkDistance(120)
			.charge(-120)
			.gravity(.05)
			.size([$scope.graphWidth, $scope.graphHeight])
			.on("tick", $scope.tick);

		$scope.svg = d3.select("#skillPanel").append("svg")
			.attr("width", $scope.graphWidth)
			.attr("height", $scope.graphHeight);

		$scope.link = $scope.svg.selectAll(".link");
		$scope.node = $scope.svg.selectAll(".node");
		
		  
		function collapse(d) {
			if (d.children) {
			  d._children = d.children;
			  d._children.forEach(collapse);
			  d.children = null;
			}
		  }

		  $scope.courses.children.forEach(collapse);
		  
		$scope.updateGraph();
		
	}
	
	$scope.updateGraph = function() {
		
	  var nodes = $scope.flatten($scope.courses),
		  links = d3.layout.tree().links(nodes);

	  // Restart the force layout.
	  $scope.force
		  .nodes(nodes)
		  .links(links)
		  .start();
		  
		$scope.link = $scope.svg.selectAll(".link");
		$scope.node = $scope.svg.selectAll(".node");

	  // Update links.
	  $scope.link = $scope.link.data(links, function(d) { return d.target.id; });

	  $scope.link.exit().remove();

	  $scope.link.enter().insert("line", ".node")
		  .attr("class", "link");

	  // Update nodes.
	  $scope.node = $scope.node.data(nodes, function(d) { return d.id; });

	  $scope.node.exit().remove();

	  var nodeEnter = $scope.node.enter().append("g")
		  .attr("class", "node")
		  .on("click", $scope.click)
		  .call($scope.force.drag)
		  //.attr("transform", function(d) { if(d.xo && d.yo) return "translate(" + d.y0 + "," + d.x0 + ")"; });

	  nodeEnter.append("circle")
		  .attr("r", function(d) { return d.size || 5; }).style("fill", $scope.color);

		  
		  // only display node labels if node has no image 
		nodeEnter.filter(function(d) {return (!d.image)}).append("text") 
			.attr("class", function(d) { return "text "+d.type; })
			.attr("text-anchor", "middle")
			.attr("dx", 0)
			.attr("dy", "-5px")
			.text(function(d) {
				return d.fullName?d.fullName:d.label;
			})
			.call(getTextBox);

		// only display a rect behind labels if node has no image 
		nodeEnter.filter(function(d) {return (!d.image)}).insert("rect","text")
			.attr("x", function(d){return d.bbox.x})
			.attr("y", function(d){return d.bbox.y})
			.attr("width", function(d){return d.bbox.width})
			.attr("height", function(d){return d.bbox.height})
			.style("fill", "white");

		function getTextBox(selection) {
			selection.each(function(d) { d.bbox = this.getBBox(); })
		}
		 

		/*if(!$scope.graphReady) for(var node of nodes){
			$scope.click(node);
		}*/
		
		var texts = [];
		$scope.svg.selectAll("text").each(function(d, i) {
			texts[i] = {bb:this.getBBox()}; // get bounding box of text field and store it in texts array
		});
		
		$scope.graphReady = true;
		  
	}
	
	/*******************************/
	
	$scope.tick = function() {
	  $scope.link.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });

	  $scope.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
	$scope.opacity = function(d) {
		return d._children ? 0.5 // collapsed package
		  : d.children ? 1 // expanded package
		  : 1;
	}

	$scope.color = function(d) {
		var color = d3.scale.category20();
		
		
	  /* // leaf node*/
		  
		  var c = "";
		  switch(d.type){
			  case "diploma": c = "orange";break;
			  case "option": c = "red";break;
			  case "course": c = "green";break;
			  case "keyword": c = "blue";break;
			  case "skill": c = "yellow";break;
			  default: c = "gray";
		  }
		  
		  console.log("type:",d.type,c);
		  return c;
	}

	// Toggle children on click.
	$scope.click = function(d) {
		
	  if (d3.event && d3.event.defaultPrevented) return; // ignore drag
	  if (d.children) {
		d._children = d.children;
		d.children = null;
	  } else {
		d.children = d._children;
		d._children = null;
	  }
	  $scope.updateGraph();
	}

	// Returns a list of all nodes under the root.
	$scope.flatten = function(root) {
	  var nodes = [], i = 0;

	  function recurse(node) {
		if (node.children) node.children.forEach(recurse);
		if (!node.id) node.id = ++i;
		nodes.push(node);
		
		
		
	  }

	  recurse(root);
	  return nodes;
	}
	
	
	/******************************/
    
    $scope.init = function(){   
        $scope.words = [];
        //$scope.initKeywords();
		$scope.initGraph();
    }
    
    $scope.init();
           
}])