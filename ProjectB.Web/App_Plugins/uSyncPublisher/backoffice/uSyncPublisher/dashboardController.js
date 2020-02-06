(function () {
    'use strict';

    function dashboardController($timeout, navigationService) {

        var vm = this;

        vm.page = {
            title: 'uSync Publisher',
            description: 'Send and Pull content from other Umbraco installs',
            navigation: [
                {
                    'name': 'settings',
                    'alias': 'settings',
                    'icon': 'icon-settings',
                    'view': Umbraco.Sys.ServerVariables.uSyncPublisher.pluginPath + 'dashboard/settings.html',
                    'active': true
                },
                {
                    'name': 'Sync',
                    'alias': 'sync',
                    'icon': 'icon-sync',
                    'view': Umbraco.Sys.ServerVariables.uSyncPublisher.pluginPath + 'dashboard/sync.html',
                }
            ]
        };

        $timeout(function () {
            navigationService.syncTree({ tree: 'uSyncPublisher', path: '-1' });
        });
    }

    angular.module('umbraco')
        .controller('uSyncPublisherDashboardController', dashboardController);

})();