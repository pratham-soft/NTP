app.controller("customerController", function($scope, $http, $cookieStore, $state, $uibModal) {
        $scope.sortColumn = "fullName";
        $scope.reverseSort = false;

            $scope.sortData = function (column) {
                $scope.reverseSort = ($scope.sortColumn == column) ?
                    !$scope.reverseSort : false;
                $scope.sortColumn = column;
            }

            $scope.getSortClass = function (column) {

                if ($scope.sortColumn == column) {
                    return $scope.reverseSort
                      ? 'arrow-down'
                      : 'arrow-up';
                }

                return '';
            }
    
    $scope.getCustomers = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 4
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            for(var i=0;i<data.length;i++){
                    data[i].fullName=data[i].user_first_name+" "+data[i].user_middle_name+" "+data[i].user_last_name;
                }
            $scope.customers = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getCustomers();

    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerDetail.html',
            controller: 'customerDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.customers[selectedItem];
                }
            }
        });
    };
});

app.controller("customerDetailController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";

    $scope.leadId = $scope.customer.user_id;

    if ($scope.customer.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.customer.userprojlist.length; i++) {
            $scope.leadUnitObj = $scope.customer.userprojlist[i];
            $scope.leadUnitObj.unitViewStatus = "N/A";
            if ($scope.customer.userprojlist[i].ProjDtl_Status != 0)
                $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.userprojlist[i].ProjDtl_Status];
            $scope.leadProjects.push($scope.leadUnitObj);
        }
    }

    $scope.deleteRow = function(projId, rowId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitDel",
            ContentType: 'application/json',
            data: [{
                "comp_guid": $cookieStore.get('comp_guid'),
                "ProjDtl_Id": projId
            }]
        }).success(function(data) {
            if (data.Comm_ErrorDesc == '0|0') {
                $("tr#" + rowId).remove();
                $("#unit" + rowId).removeClass('selected');
            }
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": $scope.leadId
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.getTypeNameById = function(typeId) {
        var typeName = '';
        switch (parseInt(typeId)) {
            case 1:
                typeName = 'Flat';
                break;
            case 2:
                typeName = 'Sites';
                break;
            case 3:
                typeName = 'Villa';
                break;
            case 4:
                typeName = 'Row Houses';
                break;
            default:
                console.log('eror');
        }
        return typeName;
    }
});