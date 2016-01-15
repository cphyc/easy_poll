'use strict';

angular.module('eduquizzApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state, gettextCatalog, $rootScope) {
    var homeTitleNavbarTrad = gettextCatalog.getString('Home');
    var pollTitleNavbarTrad = gettextCatalog.getString('Polls');
    var answerPollTitleNavbarTrad = gettextCatalog.getString('Answer polls');
    $scope.menu = [{
      'title': homeTitleNavbarTrad,
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    function updateNavbar() {
      if ($scope.isAdmin()) {
        $scope.menu.push({
          'title': pollTitleNavbarTrad,
          'link': $state.href('polls', {}, {absolute: true})
        });
      }

      if ($scope.isLoggedIn()) {
        $scope.menu.push({
          'title': answerPollTitleNavbarTrad,
          'link': $state.href('polls_answer', {}, {absolute: true})
        });
      }
    }

    updateNavbar();

    $rootScope.$on('user:connected', function() {
      updateNavbar();
    });


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
