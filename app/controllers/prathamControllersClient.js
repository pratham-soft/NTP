app.controller("unitAllocation", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    ($scope.getProjectList = function() {
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

    $scope.getPhaseList = function(projectName) {
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Blocks_Phase_Id": phase,
                "Blocks_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }

            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/AllocByUserType",
                ContentType: 'application/json',
                data: {
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "Projusrtyp": 3,
                    "Phase_Id": obj.phase,
                    "Blocks_Id": obj.blocks
                }
            }).success(function(data) {
                console.log(data);
                $scope.unitAllocationData = [];
                for (h = 0; h < data.length; h++) {
                    if (data[h].userprojlist != null) {
                        for (i = 0; i < data[h].userprojlist.length; i++) {
                            if (data[h].userprojlist[i].ProjDtl_Status != 7) {
                                $scope.unitAllocationObj = {};

                                $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                                $scope.unitAllocationObj.email = data[h].user_email_address;
                                $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                                /*$scope.unitAllocationObj.projName = data[h].userprojlist[i].Proj_Name;
                                $scope.unitAllocationObj.phaseName = data[h].userprojlist[i].Phase_Name;
                                $scope.unitAllocationObj.phaseType = 'Temp Phase Type';
                                $scope.unitAllocationObj.blockName = data[h].userprojlist[i].Blocks_Name;*/
                                $scope.unitAllocationObj.unitObj = data[h].userprojlist[i];
                                $scope.unitAllocationObj.leadID = data[h].user_id;

                                $scope.unitAllocationData.push($scope.unitAllocationObj);
                            }
                        }
                    }
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }
    $scope.viewUnitCostSheet = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitCostSheet.html',
            controller: 'unitCostSheet',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return item;
                }
            }
        });
    }

    $scope.updateUnitAllocationStatus = function(unitData) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitStatusUpdate.html',
            controller: 'unitUpdateController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitData;
                }
            }
        });
    };
});

app.controller("unitUpdateController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.unit = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.updateStatus = function(formObj) {
        if (formObj.updateStatus != undefined && formObj.updateStatus != '') {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Id": $scope.unit.unitObj.UnitDtls_Id,
                    "UnitDtls_Status": formObj.updateStatus,
                    "UnitDtls_user_id": formObj.leadID
                }
            }).success(function(data) {
                console.log(data);
                $uibModalInstance.close();
                if (data[0].UnitDtls_ErrorDesc == '0') {
                    $uibModalInstance.close();
                    $state.go("/ConvertCustomer", {
                        "leadID": $scope.unit.leadID,
                        "action": 'addCustomer'
                    });
                } else {
                    alert('some error in changing unit status.');
                }
            }).error(function() {
                alert('some error!!');
            });
        } else {
            alert('Please select any option first.');
        }
    };
});

app.controller("addUnit", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Add Unit";
    $scope.addPhaseUnitBtn = "ture";

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            //            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "0") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "0") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "0") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "0") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "0") {
                    relinquishType = "true";
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: data.UnitTypeData_lstplappv[0].plnappno,
                    planApproveDt: data.UnitTypeData_lstplappv[0].plnappdt,
                    planApproveAuth: data.UnitTypeData_lstplappv[0].plnappaut,
                    nocObtained: nocObtainedType,
                    nocDate: data.UnitTypeData_lstnoc[0].nocdt,
                    nocDocNo: data.UnitTypeData_lstnoc[0].nocdocno,
                    relinquish: relinquishType,
                    docNum: data.UnitTypeData_lstlreq[0].reqsno,
                    docDate: data.UnitTypeData_lstlreq[0].reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                //                alert("wrong");
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.savePhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": 0
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});

app.controller("editUnit", function($scope, $http, $state, $cookieStore, $stateParams) {
    var projectId = $stateParams.projId;
    var phaseId = $stateParams.phaseId;

    $scope.pageTitle = "Edit Unit";
    $scope.editPhaseUnitBtn = "ture";
    $scope.editTypeDataId = 0;

    ($scope.getPhaseDetail = function() {
        angular.element(".loader").show();

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDt/Getdata",
            ContentType: 'application/json',
            data: {
                "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                "UnitTypeData_Phase_Id": phaseId
            }
        }).success(function(data) {
            console.log(data);
            if (data.UnitTypeData_Id != 0) {
                $scope.editTypeDataId = data.UnitTypeData_Id;

                var minorType = "false";
                var nocObtainedType = "false";
                var planApprovedType = "false";
                var landConvertedType = "false";
                var relinquishType = "false";

                if (data.UnitTypeData_minor == "1") {
                    minorType = "true";
                }
                if (data.UnitTypeData_noc == "1") {
                    nocObtainedType = "true";
                }
                if (data.UnitTypeData_planappvd == "1") {
                    planApprovedType = "true";
                }
                if (data.UnitTypeData_lndconv == "1") {
                    landConvertedType = "true";
                }
                if (data.UnitTypeData_rlqyn == "1") {
                    relinquishType = "true";
                }

                var planApproveNum = '';
                var planApproveDate = '';
                var planApproveAuth = '';

                if (data.UnitTypeData_lstplappv.length > 0) {
                    planApproveNum = data.UnitTypeData_lstplappv[0].plnappno;
                    planApproveDate = data.UnitTypeData_lstplappv[0].plnappdt;
                    planApproveAuth = data.UnitTypeData_lstplappv[0].plnappaut;
                }

                var nocDate = '';
                var nocNum = '';

                if (data.UnitTypeData_lstnoc.length > 0) {
                    nocDate = data.UnitTypeData_lstnoc[0].nocdt;
                    nocNum = data.UnitTypeData_lstnoc[0].nocdocno;
                }

                var reqsno = '';
                var reqdocndt = '';

                if (data.UnitTypeData_lstlreq.length > 0) {
                    reqsno = data.UnitTypeData_lstlreq[0].reqsno;
                    reqdocndt = data.UnitTypeData_lstlreq[0].reqdocndt;
                }

                $scope.addUnit = {
                    ownerShipType: data.UnitTypeData_Phase_Id,
                    ownerName: data.UnitTypeData_ownrnm,
                    ownerSowodo: data.UnitTypeData_sowodo,
                    ownerDob: data.UnitTypeData_dob,
                    ownerAddress: data.UnitTypeData_add,
                    ownerPan: data.UnitTypeData_pan,
                    minor: minorType,
                    guardianName: data.UnitTypeData_grdnm,
                    guardianSowodo: data.UnitTypeData_gunsowodo,
                    guardianDob: data.UnitTypeData_gundob,
                    guardianAddress: data.UnitTypeData_gunadd,
                    guardianPan: data.UnitTypeData_gunpan,
                    relationshipWithMinor: data.UnitTypeData_gunrltnminor,
                    totalLandArea: data.UnitTypeData_ttllndar,
                    totalHyneArea: data.UnitTypeData_ttlhynlnd,
                    totalKarabArea: data.UnitTypeData_krblnd,
                    landConverted: landConvertedType,
                    conversionOrderDocNo: data.UnitTypeData_convordr,
                    conversionOrderDocDt: data.UnitTypeData_convordrdt,
                    planApproved: planApprovedType,
                    planApproveNo: planApproveNum,
                    planApproveDt: planApproveDate,
                    planApproveAuth: planApproveAuth,
                    nocObtained: nocObtainedType,
                    nocDate: nocDate,
                    nocDocNo: nocNum,
                    relinquish: relinquishType,
                    docNum: reqsno,
                    docDate: reqdocndt,
                    totalSaleArea: data.UnitTypeData_ttlsalearea,
                    totalPlots: data.UnitTypeData_ttlplots,
                    areaOfRoads: data.UnitTypeData_areafrroads,
                    areaOfParks: data.UnitTypeData_araafrprks,
                    areaOfCivicAmen: data.UnitTypeData_arafrcivicamn,
                    superBuiltArea: data.UnitTypeData_sprbltupara,
                    gardenArea: data.UnitTypeData_grdnara,
                    terraceArea: data.UnitTypeData_terara,
                    terraceGarden: data.UnitTypeData_tergrdn,
                    carpetArea: data.UnitTypeData_crptara,
                    plinthArea: data.UnitTypeData_pltnara,
                    noOfFloors: data.UnitTypeData_noflors,
                    noOfBedrooms: data.UnitTypeData_nobdrms,
                    commonBathrooms: data.UnitTypeData_cmnbtrms,
                    attachedBathrooms: data.UnitTypeData_attchbtrms,
                    servantRoom: data.UnitTypeData_srvntroom,
                    carParkingArea: data.UnitTypeData_carprkara
                };
            } else {
                $scope.addUnit = {
                    ownerShipType: 0,
                    nocObtained: "false",
                    planApproved: "false",
                    landConverted: "false",
                    minor: "false",
                    relinquish: "false"
                };
            }

            angular.element(".loader").hide();
        }).error(function() {
            alert("Something went wrong.");
            angular.element(".loader").hide();
        });
    })();

    $scope.editPhaseData = function(formObj, formName) {
        $scope.submit = true;
        console.log(formObj);
        if ($scope[formName].$valid) {
            //            alert("Valid Form");
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UnitDt/Save",
                ContentType: 'application/json',
                data: {
                    "UnitTypeData_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitTypeData_Phase_Id": phaseId,
                    "UnitTypeData_ownrnm": formObj.ownerName,
                    "UnitTypeData_sowodo": formObj.ownerSowodo,
                    "UnitTypeData_dob": formObj.ownerDob,
                    "UnitTypeData_add": formObj.ownerAddress,
                    "UnitTypeData_pan": formObj.ownerPan,
                    "UnitTypeData_minor": formObj.minor,
                    "UnitTypeData_grdnm": formObj.guardianName,
                    "UnitTypeData_gunsowodo": formObj.guardianSowodo,
                    "UnitTypeData_gundob": formObj.guardianDob,
                    "UnitTypeData_gunadd": formObj.guardianAddress,
                    "UnitTypeData_gunpan": formObj.guardianPan,
                    "UnitTypeData_gunrltnminor": formObj.relationshipWithMinor,
                    "UnitTypeData_ttllndar": formObj.totalLandArea,
                    "UnitTypeData_ttlhynlnd": formObj.totalHyneArea,
                    "UnitTypeData_krblnd": formObj.totalKarabArea,
                    "UnitTypeData_lndconv": formObj.landConverted,
                    "UnitTypeData_convordr": formObj.conversionOrderDocNo,
                    "UnitTypeData_convordrdt": formObj.conversionOrderDocDt,
                    "UnitTypeData_planappvd": formObj.planApproved,
                    "UnitTypeData_lstplappv": [{
                        "plnappno": formObj.planApproveNo,
                        "plnappdt": formObj.planApproveDt,
                        "plnappaut": formObj.planApproveAuth
                    }],
                    "UnitTypeData_noc": formObj.nocObtained,
                    "UnitTypeData_lstnoc": [{
                        "nocdt": formObj.nocDate,
                        "nocdocno": formObj.nocDocNo
                    }],
                    "UnitTypeData_rlqyn": formObj.relinquish,
                    "UnitTypeData_lstlreq": [{
                        "reqsno": formObj.docNum,
                        "reqdocndt": formObj.docDate
                    }],
                    "UnitTypeData_lstrel": [{
                        "relsno": "xx2",
                        "relesnoplots": "xx4"
                    }],
                    "UnitTypeData_ttlsalearea": formObj.totalSaleArea,
                    "UnitTypeData_ttlplots": formObj.totalPlots,
                    "UnitTypeData_areafrroads": formObj.areaOfRoads,
                    "UnitTypeData_araafrprks": formObj.areaOfParks,
                    "UnitTypeData_arafrcivicamn": formObj.areaOfCivicAmen,
                    "UnitTypeData_sprbltupara": formObj.superBuiltArea,
                    "UnitTypeData_grdnara": formObj.gardenArea,
                    "UnitTypeData_terara": formObj.terraceArea,
                    "UnitTypeData_tergrdn": formObj.terraceGarden,
                    "UnitTypeData_crptara": formObj.carpetArea,
                    "UnitTypeData_pltnara": formObj.plinthArea,
                    "UnitTypeData_noflors": formObj.noOfFloors,
                    "UnitTypeData_nobdrms": formObj.noOfBedrooms,
                    "UnitTypeData_cmnbtrms": formObj.commonBathrooms,
                    "UnitTypeData_attchbtrms": formObj.attachedBathrooms,
                    "UnitTypeData_srvntroom": formObj.servantRoom,
                    "UnitTypeData_carprkara": formObj.carParkingArea,
                    "UnitTypeData_Id": $scope.editTypeDataId
                }
            }).success(function(data) {
                console.log(data);
                angular.element(".loader").hide();
                $state.go("/UnitGeneration", {
                    projId: projectId,
                    phaseId: phaseId
                });
            }).error(function() {
                alert("Something went wrong.");
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
    };
});


app.controller("updateRoleIdAndAssignedTo", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
    $scope.firstDropValues=[];
    $scope.repotingDetails =[];
    $scope.roleIdDetails =[];
    $scope.updateTypeValues=[{name:"Role", value:1},{name:"Reporting to", value:2}];
    

        $scope.onChangeSelectOption=function(val){
        $scope.checkOneValue=val.value};
    
        $scope.selectUpdate=function(){
//      console.log(item);
//      console.log($scope.myModelFirst);
      
       if($scope.myModelFirst=="1"){   
         $scope.firstDropValues.length=0;
         $scope.getRoleIdDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModelFirst=="2"){
         $scope.firstDropValues.length=0;
         $scope.getReportingToDetails();
        // console.log("something happened in assigned to.");
       }
       
       
   };
   

        $scope.getRoleIdDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/RoleGet",
                ContentType: 'application/json',
                data: {
                    "role_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.roleIdDetails = data;            
                for(var i=0; i<$scope.roleIdDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.roleIdDetails[i].role_name;
                        $scope.obj.value = $scope.roleIdDetails[i].role_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }               
                //console.log("myitem:"+item);
                //console.log($scope.firstDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
            
        };
        

        $scope.getReportingToDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
                }
            }).success(function(data) {
                $scope.repotingDetails = data;            
                for(var i=0; i<$scope.repotingDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.repotingDetails[i].user_first_name +" " + $scope.repotingDetails[i].user_last_name;
                        $scope.obj.value = $scope.repotingDetails[i].user_id;
                        $scope.firstDropValues.push($scope.obj)   
//                        console.log("yo");
                        
                    }          
                //console.log($scope.firstDropValues);               
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
                console.log("something went wrong.");
            }); 
        };
    
    
    $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/AssignedTo",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
//            console.log("start");
//            console.log(item);
//            console.log($scope.myModel);
//            console.log("finish");
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
    $scope.updateRoleFunction= function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/RoleId",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModel,
            }
        }).success(function(data) {
            
            alert("Role Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.action=function(){
       
        if($scope.myModelFirst=="1"){
            console.log(item);
            console.log("kuch hua 1");
            $scope.updateRoleFunction();
        }
        
        if($scope.myModelFirst=="2"){
            console.log(item);
            console.log("kuch hua 2");
            $scope.updateAssignedTo();
        }
    };

    
    $scope.ok = function() {
    $uibModalInstance.close();
    $window.location.reload();
    };


});











app.controller("updateProPage", function($scope, $uibModalInstance, $state, item,$http, $cookieStore,$rootScope,$window) {
      $scope.secondDropValues=[];
      $scope.myModel = "";
      $scope.firstDropValues=[{name:"Lead Staus", value:1},{name:"Sales Funnel", value:2},{name:"Assigned to", value:3}];

    
   $scope.onChangeSelectOption=function(val){
    $scope.checkOneValue=val.value};
    
    $scope.getSalesFunnelDetails = function() {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SalesFunnelGet",
                ContentType: 'application/json',
                data: {
                    "salesfunnel_compguid": $cookieStore.get('comp_guid')
                }
            }).success(function(data) {
                $scope.SalesFunnelDetails = data;            
                for(var i=0; i<$scope.SalesFunnelDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.SalesFunnelDetails[i].salesfunnel_name;
                        $scope.obj.value = $scope.SalesFunnelDetails[i].salesfunnel_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }          
               // console.log($scope.secondDropValues);              
                angular.element(".loader").hide();
                  
            }).error(function() {
                angular.element(".loader").hide();
              //  console.log("something went wrong.");
            }); 
        };
    
    $scope.getEmployeesDetails = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/EmployeeDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 2
            }
        }).success(function(data) {
            $scope.EmployeesDetails = data;
            for(var i=0; i<$scope.EmployeesDetails.length;i++)
                    {
                        $scope.obj={};   
                        $scope.obj.name = $scope.EmployeesDetails[i].user_first_name +" " + $scope.EmployeesDetails[i].user_last_name;
                        $scope.obj.value = $scope.EmployeesDetails[i].user_id;
                        $scope.secondDropValues.push($scope.obj)                      
                        
                    }  
           // console.log($scope.secondDropValues);
            angular.element(".loader").hide();
            $scope.employees = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };

    
   $scope.action=function(){
     //  console.log(item);
      // console.log($scope.myModel);
       if($scope.myModel=="1"){
         $scope.secondDropValues.length=0;
        // console.log("something happened in Leads Status.");
         $scope.secondDropValues=[{name:"Hot", value:1},{name:"Warm", value:2},{name:"Cold", value:3}];
       }
      
       if($scope.myModel=="2"){   
         $scope.secondDropValues.length=0;
         $scope.getSalesFunnelDetails();
        // console.log("something happened in salesFunnel.");
       }
      
       if($scope.myModel=="3"){
         $scope.secondDropValues.length=0;
         $scope.getEmployeesDetails();
        // console.log("something happened in assigned to.");
       }
       
       
   };
    
    
        $scope.updateLeadStatus = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/leadStatus",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Lead Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
            //$scope.lead_source_list= data;
           // $scope.getLeads();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateUserFunnel = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/SalesFunnel",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Sales Funnel Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    
        $scope.updateAssignedTo = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserUpdt/AssignedTo",
            ContentType: 'application/json',
            data: {
                "user_ids":item,
                "user_compguid":$cookieStore.get('comp_guid'),
                "user_updtfields":$scope.myModelSecond,
            }
        }).success(function(data) {
            alert("Assignment Updation Sucessful!");
            angular.element(".loader").hide();
            $scope.ok();
            $state.go('/UpdateProspects');
           // $scope.lead_source_list= data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.actionSecond=function(){
       
        if($scope.myModel=="1"){
            $scope.updateLeadStatus();
        }
        
        if($scope.myModel=="2"){
            $scope.updateUserFunnel();
        }
        
        if($scope.myModel=="3"){
            $scope.updateAssignedTo();
        } 
    };
    
    $scope.ok = function() {
    $uibModalInstance.close();
         //$state.go('/UpdateProspects');
        $window.location.reload();
    };

});