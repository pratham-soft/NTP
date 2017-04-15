app.controller("editPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams, myService) {
    var Phase_Proj_Id = $stateParams.projId;
    var Phase_Id = $stateParams.phaseId;

    $scope.pageTitle = "Edit Phase";
    $scope.editPhaseBtn = true;

    ($scope.projectListFun = function() {
        angular.element(".loader").show();
        myService.getProjectList($cookieStore.get('comp_guid')).then(function(response) {
            $scope.projectList = response.data;
            angular.element(".loader").hide();
        });
    })();

    ($scope.getPhaseInfo = function() {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": Phase_Proj_Id,
                "Phase_Id": Phase_Id
            }
        }).success(function(data) {
            //console.log(data);
            editAppendFields(data);
            var phaseList = [];
            var blockIdList = [];

            if (data[0].LstofBlocks != null) {
                for (var i = 0; i < data[0].LstofBlocks.length; i++) {
                    phaseList.push(data[0].LstofBlocks[i].Blocks_Name);
                    blockIdList.push(data[0].LstofBlocks[i].Blocks_Id);
                }
            }
            $scope.projectDetails = {
                phaseName: data[0].Phase_Name,
                location: data[0].Phase_Location,
                surveyNos: data[0].Phase_Surveynos,
                unitOfMeasurement: data[0].Phase_UnitMsmnt.UnitMsmnt_Id + "",
                phaseType: data[0].Phase_UnitType.UnitType_Id,
                noOfBlocks: data[0].Phase_NoofBlocks,
                projectName: $stateParams.projId,
                blockName: phaseList,
                blockId: blockIdList
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();




    function editAppendFields(data) {
        angular.element("#noOfBlocks").html('');
        if (data[0].LstofBlocks != null) {
            for (i = 1; i <= data[0].LstofBlocks.length; i++) {
                var childDiv = '<div id="block' + data[0].LstofBlocks[i - 1].Blocks_Id + '"><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control inputWithIcon" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /> <input type="text" class="form-control dispNone" ng-model="projectDetails.blockId[' + (i - 1) + ']" ng-value="' + data[0].LstofBlocks[i - 1].Blocks_Id + '" name="blockId[' + (i - 1) + ']"/>';

                if (!data[0].LstofBlocks[i - 1].blnunitexists)
                    childDiv = childDiv + '<span ng-click="deleteBlock(' + data[0].Phase_Id + ',' + data[0].LstofBlocks[i - 1].Blocks_Id + ')" class="glyphicon glyphicon-trash delete"></span></div>';
                else
                    childDiv = childDiv + "</div>";
                var childDivComplied = $compile(childDiv)($scope);
                angular.element("#noOfBlocks").append(childDivComplied);
            }
        }
    };

    $scope.appendFields = function() {
        var index = 0;
        var placeholder = 1;
        var blockNumbers = $("#noOfBlocks > div").length;

        if (blockNumbers != 0) {
            var lastInputHtml = $("#noOfBlocks > div:last-child > input").attr('name');
            index = parseInt(lastInputHtml.substring(lastInputHtml.indexOf('[') + 1, lastInputHtml.indexOf(']'))) + 1;
            placeholder = index + 1;
        }

        var childDiv = '<div id="block' + index + '"><input type="text" placeholder="Block  ' + placeholder + ' Name" title="Block ' + index + ' Name" class="form-control inputWithIcon" name="blockName[' + (index) + ']" ng-model="projectDetails.blockName[' + (index) + ']" /></div>';
        var childDivComplied = $compile(childDiv)($scope);
        angular.element("#noOfBlocks").append(childDivComplied);

        var something = $("#blockCount").val(blockNumbers + 1);
    };

    $scope.editPhase = function(formObj, formName) {
        var noOfBlocks = $("#blockCount").val();
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                if (formObj.blockId[i] != undefined)
                    tmp.Blocks_Id = formObj.blockId[i];
                blockLst.push(tmp);
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": $stateParams.phaseId,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data);
                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if ($scope.addPhaseResult.Comm_ErrorDesc.match('0|')) {
                    $state.go("/EditUnit", {
                        projId: Phase_Proj_Id,
                        phaseId: Phase_Id
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };

    $scope.deleteBlock = function(blockId, phaseId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Delete",
            ContentType: 'application/json',
            data: {
                "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                "Blocks_Id": phaseId,
                "Blocks_Phase_Id": blockId
            }
        }).success(function(data) {
            $("#block" + phaseId).remove();
            var blockNumbers = $("#noOfBlocks > div").length;
            $("#blockCount").val(blockNumbers);
            //            $state.go("/EditPhases", {
            //                "projId": $stateParams.projId,
            //                "phaseId": $stateParams.phaseId
            //            });
            //            $state.reload();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
});

app.controller("addPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams) {
    $scope.pageTitle = "Add Phase";
    $scope.addPhaseBtn = true;

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            $scope.projectDetails = {
                phaseType: "1",
                unitOfMeasurement: "1",
                projectName: $stateParams.projId
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.appendFields = function(noOfLocation) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= noOfLocation; i++) {
            var childDiv = '<div><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i - 1) + ']" ng-model="projectDetails.blockName[' + (i - 1) + ']" /></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var blockLst = [];
            for (var i = 0; i < formObj.noOfBlocks; i++) {
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0;
                blockLst.push(tmp);
            }

            //            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                    "Phase_comp_guid": $cookieStore.get('comp_guid'),
                    "Phase_Id": 0,
                    "Phase_Proj_Id": formObj.projectName,
                    "Phase_Name": formObj.phaseName,
                    "Phase_Surveynos": formObj.surveyNos,
                    "Phase_UnitMsmnt": {
                        "UnitMsmnt_Id": formObj.unitOfMeasurement
                    },
                    "Phase_UnitType": {
                        "UnitType_Id": formObj.phaseType
                    },
                    "Phase_NoofBlocks": formObj.noOfBlocks,
                    "Phase_Location": formObj.location,
                    "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data.Comm_ErrorDesc);
                var resultData = data.Comm_ErrorDesc;
                var resDataArray = resultData.split('|');

                console.log(resDataArray);

                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if (resDataArray[0] == 0) {
                    $state.go("/AddUnit", {
                        projId: formObj.projectName,
                        phaseId: resDataArray[1]
                    });
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("phases", function($scope, $http, $cookieStore, $state, $compile) {
    $scope.typeNames = ['Flat', 'Sites', 'Villa', 'Row Houses'];

    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhases = function(projId) {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham//Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": projId
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.phaseList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            $state.go("/AddPhases", {
                "projId": formObj.projectName
            });
            /*$state.go("/AddPhases");
            $scope.projectDetails = {
                projectName : formObj.projectName
            };*/
        }
    };
});