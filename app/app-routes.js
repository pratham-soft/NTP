app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboard'
        })
        .state('/Leads', {
            url: '/Leads',
            templateUrl: 'partials/leads.html',
            controller: 'leads'
        })
        .state('/AddLead', {
            url: '/AddLead',
            templateUrl: 'partials/addLead.html',
            controller: 'addLead'
        })
        .state('/Customers', {
            url: '/Customers',
            templateUrl: 'partials/customers.html',
            controller: 'customerController'
        })
        .state('/EditLead', {
            url: '/EditLead/:leadID',
            templateUrl: 'partials/addLead.html',
            controller: 'editLead'
        })
        .state('/ProjectDetails', {
            url: '/ProjectDetails/:leadID',
            templateUrl: 'partials/projectDetails.html',
            controller: 'projectDetails'
        })
        .state('/ConvertCustomer', {
            url: '/ConvertCustomer/:action/:leadID',
            templateUrl: 'partials/convertCustomer.html',
            controller: 'convertCustomer'
        })
        .state('/AddAgent', {
            url: '/AddAgent',
            templateUrl: 'partials/addAgent.html',
            controller: 'addAgentController'
        })
        .state('/Agents', {
            url: '/Agents',
            templateUrl: 'partials/agents.html',
            controller: 'agentsController'
        })
        .state('/EditAgent', {
            url: '/EditAgent/:agentID',
            templateUrl: 'partials/addAgent.html',
            controller: 'editAgentController'
        })
        .state('/UnitAllocation', {
            url: '/UnitAllocation',
            templateUrl: 'partials/unitAllocation.html',
            controller: 'unitAllocation'
        })
        .state('/Projects', {
            url: '/Projects',
            templateUrl: 'partials/projects.html',
            controller: 'projects'
        })
        .state('/AddProject', {
            url: '/AddProject',
            templateUrl: 'partials/addProject.html',
            controller: 'addProject'
        })
        .state('/EditProject', {
            url: '/EditProject/:projId',
            templateUrl: 'partials/addProject.html',
            controller: 'editProject'
        })
        .state('/Phases', {
            url: '/Phases',
            templateUrl: 'partials/phases.html',
            controller: 'phases'
        })
        .state('/AccessRights', {
            url: '/AccessRights',
            templateUrl: 'partials/AccessRights.html',
            controller: 'AccessRights'
        })
        .state('/AddPhases', {
            url: '/AddPhases/:projId',
            templateUrl: 'partials/addPhases.html',
            controller: 'addPhases'
        })
        .state('/EditPhases', {
            url: '/EditPhases/:projId/:phaseId',
            templateUrl: 'partials/addPhases.html',
            controller: 'editPhases'
        })
        .state('/AddUnit', {
            url: '/AddUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'addUnit'
        })
        .state('/EditUnit', {
            url: '/EditUnit/:projId/:phaseId',
            templateUrl: 'partials/addUnit.html',
            controller: 'editUnit'
        })
        .state('/UnitGeneration', {
            url: '/UnitGeneration/:projId/:phaseId',
            templateUrl: 'partials/unitGeneration.html',
            controller: 'unitGeneration'
        })
        .state('/Units', {
            url: '/Units/:projId/:phaseId/:blockId',
            templateUrl: 'partials/units.html',
            controller: 'units'
        })
		.state('/CostSheetTemplate', {
            url: '/CostSheetTemplate',
            templateUrl: 'partials/costSheetTemplate.html',
            controller: 'costSheetTemplate'
        })
		.state('/BlockCostSheet', {
            url: '/BlockCostSheet',
            templateUrl: 'partials/blockCostSheet.html',
            controller: 'blockCostSheet'
        })
		.state('/EditBlockCostSheet', {
            url: '/EditBlockCostSheet/:blockId',
            templateUrl: 'partials/editBlockCostSheet.html',
            controller: 'editBlockCostSheet'
        })
		.state('/EditCostSheetTemplate', {
            url: '/EditCostSheetTemplate/:templateId',
            templateUrl: 'partials/costSheetTemplate.html',
            controller: 'costSheetTemplate'
        })
        .state('/CostSheetTemplates', {
            url: '/CostSheetTemplates',
            templateUrl: 'partials/CostSheetTemplates.html',
            controller: 'costSheetTemplates'
        })
        .state('/BlockStage', {
            url: '/BlockStage',
            templateUrl: 'partials/BlockStage.html',
            controller: 'blockStageController'
        })
        .state('/PaymentSchedule', {
            url: '/PaymentSchedule',
            templateUrl: 'partials/paymentSchedule.html',
            controller: 'paymentScheduleController'
        })
        .state('/EmployeeDetails', {
            url: '/EmployeeDetails',
            templateUrl: 'partials/employeeDetails.html',
            controller: 'employeeDetailsController'
        })
        .state('/AddEmployee', {
            url: '/AddEmployee',
            templateUrl: 'partials/addEmployee.html',
            controller: 'addEmployeeController'
        })
        .state('/EditEmployee', {
            url: '/EditEmployee/:employeeId',
            templateUrl: 'partials/addEmployee.html',
            controller: 'editEmployeeController'
        })
       .state('/Heirarchy', {
            url: '/Heirarchy',
            templateUrl: 'partials/Heirarchy.html',
            controller: 'heirarchyController'
        })
        .state('/SalaryComponentDetails', {
            url: '/SalaryComponentDetails',
            templateUrl: 'partials/salaryComponentDetails.html',
            controller: 'salaryComponentDetailsController'
        })
        .state('/AddSalaryComponent', {
            url: '/AddSalaryComponent',
            templateUrl: 'partials/addSalaryComponent.html',
            controller: 'addSalaryComponentController'
        })
        .state('/EditSalaryComponent', {
            url: '/EditSalaryComponent/:salaryHeadId',
            templateUrl: 'partials/addSalaryComponent.html',
            controller: 'editSalaryComponentController'
        })
        .state('/AddDepartment', {
            url: '/AddDepartment',
            templateUrl: 'partials/addDepartment.html',
            controller: 'addDepartmentController'
        })
		.state('/ApplyCostSheet', {
            url: '/ApplyCostSheet/:projectId/:phaseId/:blockId',
            templateUrl: 'partials/applyCostSheet.html',
            controller: 'applyCostSheet'
        })
        .state('/GenerateCostSheet', {
            url: '/GenerateCostSheet/:blockId',
            templateUrl: 'partials/generateCostSheet.html',
            controller: 'generateCostSheet'
        })
		.state('/Attendance', {
            url: '/Attendance',
            templateUrl: 'partials/attendance.html',
            controller: 'attendance'
        })
        .state('/UnitsListing', {
            url: '/UnitsListing',
            templateUrl: 'partials/unitsListing.html',
            controller: 'unitsListingController'
        })
        .state('/AlertRules', {
            url: '/AlertRules',
            templateUrl: 'partials/alertRules.html',
            controller: 'alertRules'
        })
        .state('/CreateNewRule', {
            url: '/CreateNewRule',
            templateUrl: 'partials/createNewRule.html',
            controller: 'createNewRule'
        })
        .state('/SalesFunnel', {
            url: '/SalesFunnel',
            templateUrl: 'partials/salesFunnelListing.html',
            controller: 'salesFunnelController'
        })
        .state('/Prospects', {
            url: '/Prospects',
            templateUrl: 'partials/prospects.html',
            controller: 'updateProspects'
        })
//        .state('/UpdateProspects', {
//            url: '/UpdateProspects',
//            templateUrl: 'partials/updateProspects.html',
//            controller: 'updateProspects'
//        })
//        
        .state('/AddProspect', {
            url: '/AddProspect',
            templateUrl: 'partials/addProspect.html',
            controller: 'addProspect'
        })
        .state('/EditProspect', {
            url: '/EditProspect/:leadID',
            templateUrl: 'partials/addProspect.html',
            controller: 'editProspect'
        })
        .state('/SiteVisitListing', {
            url: '/SiteVisitListing',
            templateUrl: 'partials/siteVisitListing.html',
            controller: 'siteVisitListingController'
        })
		.state('/UpdateRule', {
            url: '/UpdateRule/:ruleId/:moduleId',
            templateUrl: 'partials/updateRule.html',
            controller: 'updateRuleCtrl'
        })
        .state('/Action', {
            url: '/Action/:ruleId',
            templateUrl: 'partials/action.html',
            controller: 'actionCtrl'
        })
        .state('/Schedule', {
            url: '/Schedule/:ruleId',
            templateUrl: 'partials/schedule.html',
            controller: 'scheduleCtrl'
        })
        .state('/EmailTemplates', {
            url: '/EmailTemplates',
            templateUrl: 'partials/emailTemplates.html',
            controller: 'emailTemplatesCtrl'
        })
        .state('/CreateNewEmailTemplate', {
            url: '/CreateNewEmailTemplate',
            templateUrl: 'partials/createNewEmailTemplate.html',
            controller: 'createNewEmailTemplateCtrl'
        })
});