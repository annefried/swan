
'use strict';

angular.module('app').controller('projectEditModalController', function ($scope, $rootScope, $http, $uibModalInstance) {

    $scope.init = function () {
        $scope.loadUsers();
        $scope.projUsers = $rootScope.tableProjects[$rootScope.currentProjectIndex].users;
        $scope.projPms = $rootScope.tableProjects[$rootScope.currentProjectIndex].pms;
    };

    $scope.loadUsers = function () {
        $http.get("tempannot/user").then(function (response) {
            var usersPms = JSOG.parse(JSON.stringify(response.data)).users;
            $scope.users = [];
            $scope.pms = [];
            for (var i = 0; i < usersPms.length; i++) {
                var u = usersPms[i];
                if (u.role == 'annotator') {
                    $scope.users.push(u);
                } else {
                    if (u.role == 'projectmanager') {
                        $scope.pms.push(u);
                    }
                }
            }
        }, function (err) {
            $rootScope.addAlert({type: 'danger', msg: 'No connection to server'});
        });
    };

    $scope.addSelectedUser = function () {
        $http.post("tempannot/project/add/" + $rootScope.currentProjectId + "/" + $scope.newUser).success(function (response) {
            var emptyTemplate = ['0'];
            for (var i = 0; i < $scope.users.length; i++) {
                var u = $scope.users[i];
                if (u.id === $scope.newUser) {
                    var proj = $rootScope.tableProjects[$rootScope.currentProjectIndex];
                    proj.users.push(u);
                    if (proj.completed.length == undefined) {
                        proj.completed = emptyTemplate;
                    } else {
                        proj.completed.push(0);
                    }
                }
            }
        });
    };

    $scope.addSelectedPM = function () {
        $http.post("tempannot/project/addManager/" + $rootScope.currentProjectId + "/" + $scope.newPM).success(function (response) {
            var emptyTemplate = ['0'];
            for (var i = 0; i < $scope.pms.length; i++) {
                if ($scope.pms[i].id === $scope.newPM) {
                    $rootScope.tableProjects[$rootScope.currentProjectIndex].pms.push($scope.pms[i]);
                    if ($rootScope.tableProjects[$rootScope.currentProjectIndex].completed.length == undefined) {
                        $rootScope.tableProjects[$rootScope.currentProjectIndex].completed = emptyTemplate;
                    } else {
                        $rootScope.tableProjects[$rootScope.currentProjectIndex].completed.push(0);
                    }
                }
            }
        });
    };

    $scope.deleteUser = function (uId) {
        $http.post("tempannot/project/del/" + $rootScope.currentProjectId + "/" + uId).then(function (response) {
            for (var i = 0; i < $rootScope.tableProjects[$rootScope.currentProjectIndex].users.length; i++) {
                if ($rootScope.tableProjects[$rootScope.currentProjectIndex].users[i].id == uId)
                    $rootScope.tableProjects[$rootScope.currentProjectIndex].users.splice(i, 1);
            }

        });
    };

    $scope.deletePM = function (uId) {
        $http.post("tempannot/project/del/" + $rootScope.currentProjectId + "/" + uId).then(function (response) {
            for (var i = 0; i < $rootScope.tableProjects[$rootScope.currentProjectIndex].pms.length; i++) {
                if ($rootScope.tableProjects[$rootScope.currentProjectIndex].pms[i].id == uId)
                    $rootScope.tableProjects[$rootScope.currentProjectIndex].pms.splice(i, 1);
            }

        });
    };
    
    /**
     * Returns a complement of a main list and sublist of users. Used for
     * dropdown menus.
     *
     * @param {Array<User>} userList The main list.
     * @param {Array<User>} subList The sublist whose elements are not in the
     *                      comeplementList.
     * @return {Array<User>} complementList Contains all elements from userList
     *                      except all elements from subList.
     */
    $scope.getUserComplement = function (userList, subList) {
        if (userList == undefined) {
            return subList;
        }
        var complementList = [];
        for (var i = 0; i < userList.length; i++) {
            if (!$scope.containsUser(subList, userList[i])) {
                complementList.push(userList[i]);
            }
        }
        return complementList;
    };
    
    $scope.containsUser = function (userList, user) {
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].id == user.id) {
                return true;
            }
        }
        return false;
    };

    $scope.submit = function (name) {
        $uibModalInstance.close(name);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});